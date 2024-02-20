import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { SSOConfigs } from './entities/sso_config.entity';
import { AppEnvironmentsModule } from 'src/app_environments/app_environments.module';
import { OrganizationUsersModule } from 'src/organization_users/organization_users.module';

@Module({
  imports:[TypeOrmModule.forFeature([Organization, SSOConfigs]), AppEnvironmentsModule, OrganizationUsersModule],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports:[OrganizationService]
})
export class OrganizationModule {}
