import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { CreateAppDTO } from './dtos/create-app.dto';
import { AppsService } from './apps.service';
// import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guards';

@UseGuards(AuthGuard)
@Controller('apps')
export class AppsController {

  constructor(private readonly appsService: AppsService) { }

  @Post()
  async createApp(@User() user: any, @Body() createApp: CreateAppDTO) {
    console.log(user);
    console.log(createApp);
    const app = this.appsService.create(createApp, user?.id);

    return app;
  }

  @Get()
  async getAllApps(@User() user: any) {
    const app = this.appsService.getAllApps(user?.id)
    return app;
  }

  @Get(":id")
  async getApp(@Param('id') id: string) {
    const app = await this.appsService.getApp(id);
    return app;
  }

  @Delete(":id")
  async deleteApp(@Param('id') id: string) {
    const app = this.appsService.deleteApp(id);
    return app;
  }

  @Patch(":id")
  async updateAppName(@Body() body: any, @Param('id') id: string) {
    const app = this.appsService.updateName(id, body.name);
    return app;
  }

  @Put("icon")
  async updateIcon(@Body() body: any) {
    const app = this.appsService.updateIcon(body.id, body.icon);
    return app;
  }

}
