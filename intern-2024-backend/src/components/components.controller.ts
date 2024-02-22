import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ComponentsService } from './components.service';
import { ComponentEntity } from './entities/components.entity';

@Controller('components')
export class ComponentsController {
  constructor(private readonly componentService: ComponentsService) { }

  @Get()
  async getAllComponent() {
    const components = await this.componentService.getAllComponents();
    return components
  }

  @Get(':id')
  async getComponent(@Param('id') id: string) {
    const component = await this.componentService.getComponent(id);
    return component
  }

  @Post()
  async createComponent(@Body() content) {
    const component = await this.componentService.createComponent(content);
    return component;
  }


  @Patch(':id')
  async updateComponent(@Param('id') id: string, @Body() attr: Partial<ComponentEntity>) {
    const component = await this.componentService.updateComponent(id, attr);
    return component;
  }

  @Delete(':id')
  async deleteComponent(@Param('id') id: string) {
    // return id;
    const component = await this.componentService.deleteComponent(id);
    return component;
  }

}
