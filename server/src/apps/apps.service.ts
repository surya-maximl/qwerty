import { Injectable, NotFoundException } from '@nestjs/common';
import { AppEntity } from './entities/apps.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAppDTO } from './dtos/create-app.dto';

@Injectable()
export class AppsService {

  constructor(@InjectRepository(AppEntity) private readonly appEntitiy: Repository<AppEntity>) { }

  async create(createApp: CreateAppDTO, user: string) {
    const name = createApp.name;
    const app = await this.appEntitiy.create({ name, userId: user });
    console.log(app);

    return await this.appEntitiy.save(app);
  }

  async getAllApps(userId: string) {
    const app = await this.appEntitiy.find({
      where: {
        userId: userId
      }
    })
    return app
  }

  async getApp(id: string) {
    console.log(id)
    const findApp = await this.appEntitiy.findOne({ where: { id } })
    if (!findApp) throw new NotFoundException("App Not found");
    return findApp;
  }


  async deleteApp(appId: string) {
    const findApp = await this.appEntitiy.exists({ where: { id: appId } })
    if (findApp) {
      const app = this.appEntitiy.delete({ id: appId })
      return { msg: "App Deleted" };
    }
    throw new NotFoundException("App not Found");
  }

  async updateName(appId: string, name: string) {
    const findApp = await this.appEntitiy.findOne({ where: { id: appId } })
    if (!findApp) throw new NotFoundException("App Not found");
    findApp.name = name;
    const updatedApp = await this.appEntitiy.save(findApp);

    return updatedApp;
  }

  async updateIcon(appId: string, iconURL: string) {
    const findApp = await this.appEntitiy.findOne({ where: { id: appId } })
    if (!findApp) throw new NotFoundException("App Not found");
    findApp.icon = iconURL;
    const updatedApp = await this.appEntitiy.save(findApp);

    return updatedApp;
  }
}
