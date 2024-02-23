import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ComponentsService } from './components.service';
import { ComponentEntity } from './entities/components.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/decorators/user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('components')
export class ComponentsController {
  constructor(private readonly componentService: ComponentsService) { }

  @Get()
  async getAllComponent(@User() user: any) {
    const components = await this.componentService.getAllComponents(user.id);
    return components
  }

  @Get(':id')
  async getComponent(@Param('id') id: string, @User() user: any) {
    const component = await this.componentService.getComponent(id, user.id);
    return component
  }

  @Post()
  async createComponent(@Body() content, @User() user: any) {
    const component = await this.componentService.createComponent(content, user.id);
    return component;
  }


  @Patch(':id')
  async updateComponent(@Param('id') id: string, @Body() attr: Partial<ComponentEntity>, @User() user: any) {
    const component = await this.componentService.updateComponent(id, attr, user.id);
    return component;
  }

  @Delete(':id')
  async deleteComponent(@Param('id') id: string, @User() user: any) {
    // return id;
    const component = await this.componentService.deleteComponent(id, user.id);
    return component;
  }

}
