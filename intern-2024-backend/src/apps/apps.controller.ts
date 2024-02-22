import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateAppDTO } from './dtos/create-app.dto';
import { AppsService } from './apps.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/decorators/user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('apps')
export class AppsController {

  constructor(private readonly appsService: AppsService) { }

  
  @Post()
  async createApp(@Body() createApp: CreateAppDTO, @User() user) {
    console.log(user);
    console.log(createApp);
    const app = this.appsService.create(createApp, "1234");

    return app;
  }

  @Get()
  async getAllApps() {
    const app = this.appsService.getAllApps("1234");
    return app;
  }

  @Get(":id")
  async getApp(@Param() id: string) {
    const app = await this.appsService.getApp(id);
    return app;
  }

  @Delete()
  async deleteApp() {
    const app = this.appsService.deleteApp("4a936ef4-a03f-440f-b54d-22011e383d6a");
    return app;
  }

  @Patch()
  async updateAppName() {
    const app = this.appsService.updateName("c7ceeb79-f235-41ae-bbe3-e85a735b5615", "demo4");
    return app;
  }

  @Patch(":icon")
  async updateIcon() {
    const app = this.appsService.updateIcon("c7ceeb79-f235-41ae-bbe3-e85a735b5615", "iconvalue");
    return app;
  }

}
