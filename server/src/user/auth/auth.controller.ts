import { Body, Controller, Get, Param, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto/auth.dto';
import { User } from '../decorators/user.decorator';



@Controller('auth')
export class AuthController {

  constructor (private readonly authService:AuthService){}

  @Post('/signup')
  signup(@Body() body:SignupDto){
    return this.authService.signup(body);
  }

  @Post('/signin')
  signinp(@Body() body:SigninDto){
    return this.authService.signin(body);
  }

  @Get()
  whoAmI(@User() user) {
    return user;
  }
}
