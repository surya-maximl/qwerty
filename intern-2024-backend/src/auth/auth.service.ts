import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import {
  OrganizationUsersService,
  WORKSPACE_USER_STATUS,
} from 'src/organization_users/organization_users.service';
import { EmailService } from './email.service';
import { DeepPartial, EntityManager } from 'typeorm';
import { generateNextNameAndSlug } from 'src/helpers/utils.helper';
import { Organization } from 'src/organization/entities/organization.entity';
import { OrganizationService } from 'src/organization/organization.service';
import {
  SOURCE,
  URL_SSO_SOURCE,
  USER_STATUS,
  getUserErrorMessages,
  getUserStatusAndSource,
  isPasswordMandatory,
  lifecycleEvents,
} from 'src/helpers/user_lifecycle';
import { CookieOptions, Request, Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { OrganizationUser } from 'src/organization_users/entities/organization_user.entity';
import { SessionService } from 'src/users/session.service';
import { ConfigService } from '@nestjs/config';
import { decamelizeKeys } from 'humps';
import * as requestIp from 'request-ip';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

interface JWTPayload {
  sessionId: string;
  username: string;
  email: string;
  organizationIds: Array<string>;
  isSSOLogin: boolean;
  isPasswordLogin: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    private readonly entityManager: EntityManager,
    private readonly organizationService: OrganizationService,
    private readonly organizationUsersService: OrganizationUsersService,

    private readonly sessionService: SessionService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,

  ) { }


  private async validateUser(
    email: string,
    password: string,
    organizationId?: string,
  ) {
    const user = await this.usersService.findByEmail(
      email,
      organizationId,
      WORKSPACE_USER_STATUS.ACTIVE,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    if (user.status !== USER_STATUS.ACTIVE) {
      throw new UnauthorizedException(getUserErrorMessages(user.status));
    }

    const passwordRetryAllowed = 5;

    if (user.passwordRetryCount >= 5) {
      throw new UnauthorizedException('Reached Maximum Password Retry Limit');
    }
    // console.log(password);
    // console.log(user.password);
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      await this.usersService.updateUser(user.id, {
        passwordRetryCount: user.passwordRetryCount + 1,
      });
      throw new UnauthorizedException('Invalid Credentials');
    }

    return user;
  }

  async login(
    response: Response,
    request:Request,
    email: string,
    password: string,
    organizationId?: string,
    loggedInUser?: User,
  ) {
    const user = await this.validateUser(email, password, organizationId);
    let organization:Organization;
    return await this.dbTransactionWrap(async (manager: EntityManager) => {
      if (!organizationId) {
        const organizationList: Organization[] =
          await this.organizationService.findOrganizationWithLoginSupport(
            user,
            'form',
          );

        const defaultOrgDetails: Organization = organizationList?.find(
          (e) => e.id === user.defaultOrganizationId,
        );
        if(defaultOrgDetails){
          organization=defaultOrgDetails;
        }
        else if(organizationList?.length>0){
          organization = organizationList[0];
        }
        else{
          const {name, slug} = generateNextNameAndSlug("My Workspace");
          organization = await this.organizationService.create(name,slug,user,manager);
        }

        user.organizationId = organization.id;
      }
      else{
        user.organizationId = organizationId;

        organization = await this.organizationService.get(user.organizationId);

        const formConfigs = organization?.ssoConfigs?.find((sso)=>sso.sso==='form');
        if(!formConfigs?.enabled){
          throw new UnauthorizedException('Password Login is disabled for the organization');
        }
      }

      await this.usersService.updateUser(
        user.id,
        {
          ...(user.defaultOrganizationId !== user.organizationId && {defaultOrganizationId:organization.id}),
          passwordRetryCount:0
        },
        manager
      );

      return await this.generateLoginResultPayload(response,request,user,organization,false,true,loggedInUser);
    });
  }

  async signup(email: string, name: string, password: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (
      existingUser?.organizationUsers.some(
        (e) => e.status === WORKSPACE_USER_STATUS.ACTIVE,
      )
    ) {
      throw new NotAcceptableException('Email Already Exists');
    }

    if (existingUser?.invitationToken) {
      await this.emailService
        .sendWelcomeEmail(
          existingUser.email,
          existingUser.firstName,
          existingUser.invitationToken,
        )
        .catch((err) => console.error(err));
      throw new NotAcceptableException(
        'The user is already registered. Please check your inbox for the activation link.',
      );
    }

    let organization: Organization;

    const names = { firstName: '', lastName: '' };
    if (name) {
      const [firstName, ...rest] = name.split(' ');
      names['firstName'] = firstName;
      if (rest.length != 0) {
        const lastName = rest.join(' ');
        names['lastName'] = lastName;
      }
    }

    await this.dbTransactionWrap(async (manager: EntityManager) => {
      const { name, slug } = generateNextNameAndSlug('My Workspace');
      organization = await this.organizationService.create(
        name,
        slug,
        null,
        manager,
      );
      const user = await this.usersService.create(
        {
          email,
          password,
          ...(names.firstName && { firstName: names.firstName }),
          ...(names.lastName && { lastName: names.lastName }),
          ...getUserStatusAndSource(lifecycleEvents.USER_SIGN_UP),
        },
        organization.id,
        true,
        null,
        manager,
      );
      await this.organizationUsersService.create(
        user,
        organization,
        true,
        manager,
      );
      this.emailService
        .sendWelcomeEmail(user.email, user.firstName, user.invitationToken)
        .catch((err) => console.log(err));
    });
    return {
      success: true,
      message: 'Activation Link is sent.',
    };
  }

  async setupAccountFromInvitationToken(
    response: Response,
    request: Request,
    createUserDto: CreateUserDto,
  ) {
    const {
      companyName,
      companySize,
      token,
      role,
      organizationToken,
      password,
      source,
      phoneNumber,
    } = createUserDto;

    if (!token) {
      throw new BadRequestException('Invalid Token');
    }

    return await this.dbTransactionWrap(async (manager: EntityManager) => {
      const user: User = await manager.findOne(User, {
        where: { invitationToken: token },
      });

      let organizationUser: OrganizationUser;
      let isSSOVerify: boolean;

      if (organizationToken) {
        organizationUser = await manager.findOne(OrganizationUser, {
          where: { invitationToken: organizationToken },
          relations: ['user'],
        });
      }

      if (user?.organizationUsers) {
        if (isPasswordMandatory(user.source) && !password) {
          throw new BadRequestException('Please Enter Password');
        }

        const defaultOrganizationUser: OrganizationUser =
          user.organizationUsers.find(
            (e) => e.organizationId === user.defaultOrganizationId,
          );

        if (!defaultOrganizationUser) {
          throw new BadRequestException('Invalid Invitation Link');
        }

        isSSOVerify =
          source === URL_SSO_SOURCE &&
          (user.source === SOURCE.GOOGLE || user.source === SOURCE.GIT);

        const lifecycleParams = getUserStatusAndSource(
          isSSOVerify
            ? lifecycleEvents.USER_SSO_ACTIVATE
            : lifecycleEvents.USER_REDEEM,
          organizationUser ? SOURCE.INVITE : SOURCE.SIGNUP,
        );

        await this.usersService.updateUser(
          user.id,
          {
            ...(role ? { role } : {}),
            companySize,
            companyName,
            phoneNumber,
            invitationToken: null,
            ...(isPasswordMandatory(user.source) ? { password } : {}),
            ...lifecycleParams,
            updatedAt: new Date(),
          },
          manager,
        );

        await this.organizationUsersService.activateOrganization(
          defaultOrganizationUser,
          manager,
        );
      } else {
        throw new BadRequestException('Invalid Invitation Link');
      }

      if (organizationUser) {
        await this.organizationUsersService.activateOrganization(
          organizationUser,
          manager,
        );

        await this.usersService.updateUser(
          organizationUser.user.id,
          { defaultOrganizationId: organizationUser.organizationId },
          manager,
        );
      }

      const organization = await manager.findOne(Organization, {
        where: {
          id: organizationUser?.organizationId || user.defaultOrganizationId,
        },
      });

      const isInstanceSSOLogin = !organizationUser && isSSOVerify;

      return this.generateLoginResultPayload(
        response,
        request,
        user,
        organization,
        isInstanceSSOLogin,
        !isSSOVerify,
      );
    });
  }

  async generateLoginResultPayload(
    response: Response,
    request: Request,
    user: User,
    organization: DeepPartial<Organization>,
    isInstanceSSO: boolean,
    isPasswordLogin: boolean,
    loggedInUser?: User,
    manager?: EntityManager,
  ) {
    const organizationIds = new Set([

      ...(loggedInUser?.id === user.id
        ? loggedInUser?.organizationIds || []
        : []),
      organization.id,

    ]);

    let sessionId = loggedInUser?.sessionId;


    if (loggedInUser?.id !== user.id) {
      const session = await this.sessionService.createSession(
        user.id,
        `IP:${request?.clientIp || requestIp.getClientIp(request) || 'unknown'} UA: ${request?.headers['user-agent'] || 'unknown'}`,
        manager,
      );
      sessionId = session.id;
    }


    const JWTPayload: JWTPayload = {
      sessionId: sessionId,
      username: user.id,
      email: user.email,
      organizationIds: [...organizationIds],
      isSSOLogin: loggedInUser?.isSSOLogin || isInstanceSSO,
      isPasswordLogin: loggedInUser?.isPasswordLogin || isPasswordLogin,
    };

    user.organizationId = organization.id;

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 2 * 365 * 24 * 60 * 60 * 1000,
      secure: true,
    };

    const userToken = this.jwtService.sign(JWTPayload);
    response.cookie(
      'tj_auth_token',
      userToken,
      cookieOptions,
    );

    return decamelizeKeys({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      currentOrganizationId: organization.id,
      currentOrgnizationId: organization.id,
      currentOrganizationSlug: organization.slug,
      token:userToken
    });
  }

  async logout(userId:string,sessionId:string,response:Response){
    response.clearCookie('tj_auth_token');
    return await this.sessionService.terminateSession(userId,sessionId,response);
  }

  async dbTransactionWrap(
    operation: (...args) => any,
    manager?: EntityManager,
  ): Promise<any> {
    if (manager) {
      return await operation(manager);
    } else {
      return await this.entityManager.transaction(async (manager) => {
        return await operation(manager);
      });
    }
  }
}
