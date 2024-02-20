import { Injectable } from '@nestjs/common';
import { CreateOrganizationUserDto } from './dto/create-organization_user.dto';
import { UpdateOrganizationUserDto } from './dto/update-organization_user.dto';
import { User } from 'src/users/entities/user.entity';
import { DeepPartial, EntityManager } from 'typeorm';
import { Organization } from 'src/organization/entities/organization.entity';
import { OrganizationUser } from './entities/organization_user.entity';
import * as uuid from 'uuid';

export enum WORKSPACE_USER_STATUS {
  INVITED = 'invited',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

@Injectable()
export class OrganizationUsersService {

  constructor(private readonly entityManager:EntityManager){}

  async create(
    user: User,
    organization: DeepPartial<Organization>,
    isInvite?: boolean,
    manager?: EntityManager
  ): Promise<OrganizationUser> {
    return await this.dbTransactionWrap(async (manager: EntityManager) => {
      return await manager.save(
        manager.create(OrganizationUser, {
          user,
          organization,
          invitationToken: isInvite ? uuid.v4() : null,
          status: isInvite ? WORKSPACE_USER_STATUS.INVITED : WORKSPACE_USER_STATUS.ACTIVE,
          role: 'all-users',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );
    }, manager);
  }

  async activateOrganization(organizationUser: OrganizationUser, manager?: EntityManager) {
    await this.dbTransactionWrap(async (manager: EntityManager) => {
      await manager.update(OrganizationUser, organizationUser.id, {
        status: WORKSPACE_USER_STATUS.ACTIVE,
        invitationToken: null,
      });
    }, manager);
  }

  findAll() {
    return `This action returns all organizationUsers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} organizationUser`;
  }

  update(id: number, updateOrganizationUserDto: UpdateOrganizationUserDto) {
    return `This action updates a #${id} organizationUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} organizationUser`;
  }

  async dbTransactionWrap(operation: (...args) => any, manager?: EntityManager): Promise<any> {
    if (manager) {
      return await operation(manager);
    } else {
      return await this.entityManager.transaction(async (manager) => {
        return await operation(manager);
      });
    }
  }

  
}
