import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateAppDTO } from './dtos/create-app.dto';
import { AppsService } from './apps.service';

@Controller('apps')
export class AppsController {

  constructor(private readonly appsService: AppsService) { }

  @Post()
  async createApp(@Body() createApp: CreateAppDTO) {
    console.log(createApp);
    const app = this.appsService.create(createApp);
    return app;
  }

  @Get()
  async getAllApps() {
    const app = this.appsService.getAllApps();
    return app;
  }

  @Get(":id")
  async getApp(@Param() id: string) {
    const app = await this.appsService.getApp(id);
  }
}
