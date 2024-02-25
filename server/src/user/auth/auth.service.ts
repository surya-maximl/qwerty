import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SigninDto, SignupDto, UserInfoDto } from './dto/auth.dto';
import { randomBytes, scrypt as _scrypt, } from 'crypto';
import { promisify } from 'util';
import * as jwt from "jsonwebtoken";
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectUnsubscribedError } from 'rxjs';
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly user: Repository<User>) { }

  async signup({ email, password, name, phone }: SignupDto) {

    const user = await this.user.findOne({ where: { email: email } })

    if (user) throw new NotFoundException("User Already exist");
    //Hash the password
    //Generate the salt 
    const salt = randomBytes(8).toString('hex');
    //Hash the password and salt and join the result  
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + "." + hash.toString('hex');

    const newUser = await this.user.create({
      name,
      email,
      password: result,
      phoneNumber: phone
    })

    await this.user.save(newUser)

    const token = await jwt.sign({
      name,
      id: newUser.id
    }, process.env.JWT_TOKEN, {
      expiresIn: 360000
    });
    return {
      username: newUser.name,
      id: newUser.id,
      token,
      email: newUser.email
    };
  }

  async signin({ email, password }: SigninDto) {
    const user = await this.user.findOne({ where: { email: email } })
    if (!user) throw new NotFoundException("User Not found");

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) throw new BadRequestException("Password or email do not match")

    const token = await jwt.sign({
      name: user.name,
      id: user.id
    }, process.env.JWT_TOKEN, {
      expiresIn: 360000
    });

    return {
      username: user.name,
      id: user.id,
      token,
      email
    };
  }

  async updateUserInfo(userId: string, body: UserInfoDto) {
    const user = await this.user.findOne({ where: { id: userId } })
    if (!user) throw new NotFoundException("User Not Found");
    Object.assign(user, body);
    const updatedUserInfo = await this.user.save(user);

    return updatedUserInfo
  }
  async getUserInfo(userId: string) {
    const user = await this.user.findOne({ where: { id: userId } })
    if (!user) throw new NotFoundException("User Not Found");
    return user;
  }
}
