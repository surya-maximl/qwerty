import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppEnvironmentsService } from './app_environments.service';
import { CreateAppEnvironmentDto } from './dto/create-app_environment.dto';
import { UpdateAppEnvironmentDto } from './dto/update-app_environment.dto';
import { EmailService } from '../auth/email.service';

@Controller('app-environments')
export class AppEnvironmentsController {
  constructor(private readonly appEnvironmentsService: AppEnvironmentsService,
    ) {}

  @Post()
  create(@Body() createAppEnvironmentDto: CreateAppEnvironmentDto) {
    // return this.appEnvironmentsService.create(createAppEnvironmentDto);
  }

  @Get()
  findAll() {
    return this.appEnvironmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appEnvironmentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppEnvironmentDto: UpdateAppEnvironmentDto) {
    return this.appEnvironmentsService.update(+id, updateAppEnvironmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appEnvironmentsService.remove(+id);
  }
}
