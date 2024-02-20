import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { OrganizationModule } from './organization/organization.module';
import { OrganizationUsersModule } from './organization_users/organization_users.module';
import { DatabaseModule } from './config/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppEnvironmentsModule } from './app_environments/app_environments.module';
import { AppsModule } from './apps/apps.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, OrganizationModule, UsersModule, OrganizationUsersModule, AuthModule, AppEnvironmentsModule, AppsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
