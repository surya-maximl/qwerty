import { Injectable } from '@nestjs/common';
import { AppEntity } from './entities/app.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAppDTO } from './dtos/create-app.dto';

@Injectable()
export class AppsService {

  constructor(@InjectRepository(AppEntity) private readonly appEntitiy: Repository<AppEntity>) { }

  async create(createApp: CreateAppDTO) {
    console.log(createApp);
  }

  async getAllApps() {
    return [1, 2];
  }

  async getApp(id: string) {
    return "app";
  }

}
