import { Controller, Get, Post } from '@nestjs/common';
import { ComponentsService } from './components.service';

@Controller('components')
export class ComponentsController {
  constructor(private readonly componentService: ComponentsService) { }

  @Get()
  getAllComponent() {
    return this.componentService.getAllComponents();
  }

  @Post()
  createComponent() {

  }

}
