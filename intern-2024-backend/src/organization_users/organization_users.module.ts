import { Module } from '@nestjs/common';
import { OrganizationUsersService } from './organization_users.service';
import { OrganizationUsersController } from './organization_users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationUser } from './entities/organization_user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([OrganizationUser])],
  controllers: [OrganizationUsersController],
  providers: [OrganizationUsersService],
})
export class OrganizationUsersModule {}
