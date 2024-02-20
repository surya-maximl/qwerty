import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailService } from './email.service';
import { SignupDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Response } from 'express';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto){
    return this.authService.signup(signupDto.email, signupDto.name, signupDto.password);
  }

  @Post('setup-account-from-token')
  async create(@Body() createUserDto: CreateUserDto, @Res({passthrough:true}) response:Response){
    return await this.authService.setupAccountFromInvitationToken(response,createUserDto);
  }

}
