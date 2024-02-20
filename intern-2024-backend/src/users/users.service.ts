import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as uuid from 'uuid';
import { cleanObject } from 'src/helpers/utils.helper';
import { WORKSPACE_USER_STATUS } from './enum/data.enum';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly entityManager: EntityManager
  ){}

  async getCount():Promise<number>{
    return this.usersRepository.count();
  }

  async findOne(id:string){
    return this.usersRepository.findOne({where:{id}});
  }

  async findByPasswordResetToken(token:string){
    return this.usersRepository.findOne({
      where:{
        forgotPasswordToken:token
      }
    });
  }

  async findByEmail(email:string, organizationId?:string, status?:string | Array<string>, manager?:EntityManager){
    return await this.dbTransactionWrap(async(manager:EntityManager)=>{
      if(!organizationId){
        return manager.findOne(User,{
          where:{email},
          relations:['organization'],
        });
      }
      else{
        const statusList = status ? typeof status === 'object' ? status : [status] : [WORKSPACE_USER_STATUS.ACTIVE, WORKSPACE_USER_STATUS.INVITED, WORKSPACE_USER_STATUS.ARCHIVED];

        return await manager.createQueryBuilder(User,'users')
        .innerJoinAndSelect(
          'users.organizationUsers',
          'organization_users',
          'organization_users.organizationId = :organizationId',
          {organizationId}
        )
        .where('organization_users.status IN(:...statusList)',{statusList})
        .andWhere('users.email = :email',{email})
        .getOne();

      }
    },manager)
  }

  async create(userDetails: Partial<User>, organizationId:string,isInvite?:boolean, defaultOrganizationId?:string, manager?:EntityManager) {
    const {email, firstName, lastName, password, source, status, phoneNumber} = userDetails;
    let user:User;

    await this.dbTransactionWrap(async(manager:EntityManager)=>{
      user= manager.create(User,{
        email,
        firstName,
        lastName,
        password,
        phoneNumber,
        source,
        status,
        invitationToken: isInvite? uuid.v4() : null,
        defaultOrganizationId: defaultOrganizationId || organizationId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await manager.save(user);
    })

    return user;
  }

  async update(userId: string, details: any, manager?:EntityManager, organizationId?:string){
    const {forgotPasswordToken, password, firstName, lastName, source} = details;
    const updateDetails = {
      forgotPasswordToken,
      firstName,
      lastName,
      password,
      source
    };

    //removing keys with undefined values
    cleanObject(updateDetails);
    return await this.dbTransactionWrap(async(manager:EntityManager)=>{
      const user = await manager.update(User, userId, updateDetails);

      return user;
    }, manager);
  }

  async updateUser(userId:string, details: Partial<User>, manager?:EntityManager){
    await this.dbTransactionWrap(async(manager:EntityManager)=>{
      await manager.update(User,userId,details);
    },manager);
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
