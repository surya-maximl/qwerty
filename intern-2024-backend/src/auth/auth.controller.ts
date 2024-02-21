import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailService } from './email.service';
import { SignupDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Request, Response, response } from 'express';
import { IpAddress } from 'src/decorators/ip_address.decorator';
import { AuthUserDto } from './dto/user.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(
      signupDto.email,
      signupDto.name,
      signupDto.password,
    );
  }

  @Post('setup-account-from-token')
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    return await this.authService.setupAccountFromInvitationToken(
      response,
      request,
      createUserDto,
    );
  }

  @Post('authenticate')
  async login(
    @Body() authUserDto: AuthUserDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    return this.authService.login(response,request,authUserDto.email,authUserDto.password);
  }
}
