import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ComponentService } from './component.service';
import { ComponentEntity } from './entities/component.entity';
// import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guards';
import { appendFile } from 'fs';

@UseGuards(AuthGuard)
@Controller('components')
export class ComponentController {
  constructor(private readonly componentService: ComponentService) { }

  @Get(':appId')
  async getAllComponent(@Param('appId') appId: string, @User() user: any) {
    const components = await this.componentService.getAllComponents(appId, user?.id);
    return components
  }

  @Get(':appId/:id')
  async getComponent(@Param('id') id: string, @Param('appId') appId: string, @User() user: any) {
    const component = await this.componentService.getComponent(id, appId, user?.id);
    return component
  }

  @Post(':appId')
  async createComponent(@Param('appId') appId: string, @Body() content: any, @User() user: any) {
    const component = await this.componentService.createComponent(appId, content, user?.id);
    return component;
  }


  @Patch(':appId/:id')
  async updateComponent(@Param('id') id: string, @Param('appId') appId: string, @Body() attr: Partial<ComponentEntity>, @User() user: any) {
    const component = await this.componentService.updateComponent(id, appId, attr, user?.id);
    return component;
  }

  @Delete(':appId/:id')
  async deleteComponent(@Param('id') id: string, @Param('appId') appId: string, @User() user: any) {
    // return id;
    const component = await this.componentService.deleteComponent(id, appId, user?.id);
    return component;
  }

}
