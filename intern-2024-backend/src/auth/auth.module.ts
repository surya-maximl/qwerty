import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailService } from './email.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { OrganizationModule } from 'src/organization/organization.module';
import { OrganizationUsersModule } from 'src/organization_users/organization_users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports:[PassportModule, JwtModule.registerAsync({
    useFactory:(config:ConfigService)=>{
      return{
        secret:'jisusjdbcudsic',
      }
    },
    inject:[ConfigService]
  }),UsersModule, OrganizationModule, OrganizationUsersModule],
  controllers: [AuthController],
  providers: [AuthService, EmailService, JwtStrategy],
  exports:[JwtModule]
})
export class AuthModule {}
