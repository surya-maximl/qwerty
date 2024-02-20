import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { User } from 'src/users/entities/user.entity';
import { DataBaseConstraints } from 'src/helpers/db_constraints.constants';
import { catchDbException } from 'src/helpers/utils.helper';
import { AppEnvironmentsService } from 'src/app_environments/app_environments.service';
import { OrganizationUsersService } from 'src/organization_users/organization_users.service';
import { InjectRepository } from '@nestjs/typeorm';

const orgConstraints = [
  {
    dbConstraint: DataBaseConstraints.WORKSPACE_NAME_UNIQUE,
    message: 'This workspace name is already taken.',
  },
  {
    dbConstraint: DataBaseConstraints.WORKSPACE_SLUG_UNIQUE,
    message: 'This workspace slug is already taken.',
  },
];


@Injectable()
export class OrganizationService {

  constructor(private readonly entityManager: EntityManager,
    private readonly appEnvironmentService: AppEnvironmentsService,
    private readonly organizationUserService: OrganizationUsersService,
    @InjectRepository(Organization)
    private readonly organizationEntity:Repository<Organization>
    ){}

  async create(name:string, slug:string, user:User, manager?:EntityManager) {
    let organization:Organization;

    await this.dbTransactionWrap(async(manager:EntityManager)=>{

      organization = await catchDbException(async()=>{
        return await manager.save(
          manager.create(Organization,{
            ssoConfigs:[
              {
                sso:'form',
                enabled:true,
              }
            ],
            name,
            slug,
            createdAt:new Date(),
            updatedAt:new Date()
          })
        )
      }, orgConstraints);

      await this.appEnvironmentService.createDefaultEnvironments(organization.id,manager);

      if(user){
        await this.organizationUserService.create(user,organization,false,manager);
      }
      console.log(await manager.find(Organization));

    },manager);

    

    return organization;
  }

  findAll() {
    return `This action returns all organization`;
  }

  findOne(id: number) {
    return `This action returns a #${id} organization`;
  }

  update(id: number) {
    return `This action updates a #${id} organization`;
  }

  remove(id: number) {
    return `This action removes a #${id} organization`;
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
