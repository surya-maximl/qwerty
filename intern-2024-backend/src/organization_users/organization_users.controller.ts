import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrganizationUsersService } from './organization_users.service';
import { CreateOrganizationUserDto } from './dto/create-organization_user.dto';
import { UpdateOrganizationUserDto } from './dto/update-organization_user.dto';

@Controller('organization-users')
export class OrganizationUsersController {
  constructor(private readonly organizationUsersService: OrganizationUsersService) {}

  @Post()
  create(@Body() createOrganizationUserDto: CreateOrganizationUserDto) {
    // return this.organizationUsersService.create(createOrganizationUserDto);
  }

  @Get()
  findAll() {
    return this.organizationUsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationUsersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrganizationUserDto: UpdateOrganizationUserDto) {
    return this.organizationUsersService.update(+id, updateOrganizationUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationUsersService.remove(+id);
  }
}
