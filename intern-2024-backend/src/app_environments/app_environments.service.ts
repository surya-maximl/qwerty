import { Injectable } from '@nestjs/common';
import { CreateAppEnvironmentDto } from './dto/create-app_environment.dto';
import { UpdateAppEnvironmentDto } from './dto/update-app_environment.dto';
import { EntityManager } from 'typeorm';
import { defaultAppEnvironments } from 'src/helpers/utils.helper';
import { AppEnvironment } from './entities/app_environment.entity';

@Injectable()
export class AppEnvironmentsService {

  constructor(private readonly entityManager: EntityManager){}

  async createDefaultEnvironments(organizationId: string, manager?: EntityManager) {
    await this.dbTransactionWrap(async (manager: EntityManager) => {
      await Promise.all(
        defaultAppEnvironments.map(async (en) => {
          const env = manager.create(AppEnvironment, {
            organizationId: organizationId,
            name: en.name,
            isDefault: en.isDefault,
            priority: en.priority,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          await manager.save(env);
        })
      );
    }, manager);
  }

  create(createAppEnvironmentDto: CreateAppEnvironmentDto) {
    return 'This action adds a new appEnvironment';
  }

  findAll() {
    return `This action returns all appEnvironments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appEnvironment`;
  }

  update(id: number, updateAppEnvironmentDto: UpdateAppEnvironmentDto) {
    return `This action updates a #${id} appEnvironment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appEnvironment`;
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
