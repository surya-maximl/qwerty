import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SigninDto, SignupDto, UserInfoDto } from './dto/auth.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import * as jwt from 'jsonwebtoken';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectUnsubscribedError, find } from 'rxjs';
import { EmailService } from './email.service';
const scrypt = promisify(_scrypt);

interface jwtPayload {
  name: string;
  id: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
    private readonly emailService: EmailService,
  ) {}

  async signup({ email, password, name }: SignupDto) {
    const user = await this.user.findOne({ where: { email: email } });

    if (user) throw new NotFoundException('User Already exist');
    //Hash the password
    //Generate the salt
    const salt = randomBytes(8).toString('hex');
    //Hash the password and salt and join the result
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    const newUser = await this.user.create({
      name,
      email,
      password: result,
    });

    await this.user.save(newUser);

    const token = await jwt.sign(
      {
        name,
        id: newUser.id,
      },
      process.env.JWT_TOKEN,
      {
        expiresIn: 360000,
      },
    );

    console.log(token);

    return this.emailService.sendWelcomeEmail(
      newUser.email,
      newUser.name,
      newUser.id,
      token,
    );
  }

  async signin({ email, password }: SigninDto) {
    const user = await this.user.findOne({ where: { email: email } });
    if (!user) throw new NotFoundException('User Not found');
    let token = await jwt.sign(
      {
        name: user.name,
        id: user.id,
      },
      process.env.JWT_TOKEN,
      {
        expiresIn: 360000,
      },
    );
    if (!user.validated) {
      await this.emailService.sendWelcomeEmail(
        email,
        user.name,
        user.id,
        token,
      );
      return {
        msg: 'Setup Account',
        emailSent: true,
      };
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex'))
      throw new BadRequestException('Password or email do not match');

    return {
      username: user.name,
      id: user.id,
      token,
      email,
      company: user.company,
      phoneNumber: user.phoneNumber,
    };
  }

  async setUpAccount({ company, phoneNumber, userId, token }: any) {
    // const userToken = await jwt.decode(token) as jwtPayload;
    // console.log(typeof userToken)
    // console.log(userToken, company, phone);
    const findUser = await this.user.findOne({ where: { id: userId } });
    if (!findUser)
      throw new NotFoundException('User Not Found. Please register');
    if (findUser.validated)
      throw new BadRequestException('User Already Registered. Please Login');
    findUser.validated = true;
    findUser.company = company;
    findUser.phoneNumber = phoneNumber;

    const update = await this.user.save(findUser);
    console.log(update);
    return {
      username: findUser.name,
      id: findUser.id,
      token,
      company: findUser.company,
      phoneNumber: findUser.phoneNumber,
      email: findUser.email,
    };
  }

  async updateUserInfo(userId: string, body: UserInfoDto) {
    const user = await this.user.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User Not Found');
    Object.assign(user, body);
    const updatedUserInfo = await this.user.save(user);

    return updatedUserInfo;
  }
  async getUserInfo(userId: string) {
    const user = await this.user.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }

  async userDetails(user: any) {
    const id = user?.id;
    let findUser = null;
    if (id) {
      findUser = await this.user.findOne({ where: { id } });
    }
    if (!findUser) throw new NotFoundException('User Not Found');
    return {
      email: findUser.email,
      username: findUser.name,
      id: findUser.id,
      company: findUser.company,
      phoneNumber: findUser.phoneNumber,
    };
  }
}
