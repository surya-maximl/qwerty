import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto, UserInfoDto } from './dto/auth.dto';
import { User } from '../decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() body: SignupDto) {
    return await this.authService.signup(body);
  }

  @Post('/signin')
  async signin(@Body() body: SigninDto) {
    return await this.authService.signin(body);
  }

  @Get()
  whoAmI(@User() user) {
    const userDetails = this.authService.userDetails(user);
    return userDetails;
  }

  @Post('setup-account-from-token')
  async setUpAccount(@Body() body: any) {
    const user = await this.authService.setUpAccount(body);
    return user;
  }

  @UseGuards(AuthGuard)
  @Patch('update-user-info')
  async updateInfo(@User() user: any, @Body() body: UserInfoDto) {
    const updatedInfo = await this.authService.updateUserInfo(user.id, body);
    return updatedInfo;
  }

  @UseGuards(AuthGuard)
  @Get('update-user-info')
  async getUserInfo(@User() user: any) {
    const userInfo = await this.authService.getUserInfo(user.id);
    return userInfo;
  }
}
