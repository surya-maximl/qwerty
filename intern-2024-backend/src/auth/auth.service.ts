import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
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
  getUserStatusAndSource,
  isPasswordMandatory,
  lifecycleEvents,
} from 'src/helpers/user_lifecycle';
import { Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { OrganizationUser } from 'src/organization_users/entities/organization_user.entity';
import { RequestContext } from 'src/helpers/request-context';
import { SessionService } from 'src/users/session.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    private readonly entityManager: EntityManager,
    private readonly organizationService: OrganizationService,
    private readonly organizationUsersService: OrganizationUsersService,
    private readonly sessionService: SessionService
  ) { }

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
      this.emailService
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
        user,
        organization,
        isInstanceSSOLogin,
        !isSSOVerify,
      );
    });
  }

  async generateLoginResultPayload(
    response: Response,
    user: User,
    organization: DeepPartial<Organization>,
    isInstanceSSO: boolean,
    isPasswordLogin: boolean,
    loggedInUser?: User,
    manager?: EntityManager,
  ) {

    const request = RequestContext?.currentContext?.req;
    const organizationIds = new Set([
      ...(loggedInUser?.id === user.id ? loggedInUser?.organizationIds || [] : []),
      organization.id
    ]);

    let sessionId = loggedInUser?.sessionId;

    // if(loggedInUser?.id !==user.id){
    //   const session = await this.sessionService.createSession(
    //     user.id,
    //     `IP:${request?.clientIp || requestIp.getClientIp(request) || 'unknown'} UA: ${request?.header['user-agent']|| 'unknown'}`,
    //     manager
    //   );
    //   sessionId = session.id;
    // }

    // return sessionId


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
