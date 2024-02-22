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
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailService } from './email.service';
import { SignupDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Request, Response, response } from 'express';
import { AuthUserDto } from './dto/user.dto';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { SessionService } from 'src/users/session.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly sessionService:SessionService
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

  @UseGuards(AuthGuard('jwt'))
  @Get('testing')
  async test(@User() user:any ){
    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  async terminateUserSession(@User() user, @Res({ passthrough: true }) response: Response) {
    return await this.authService.logout(user.id, user.sessionId, response);
    
  }
}
