import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from 'src/decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const {email,firstName,lastName,password,phoneNumber,source,status, organizationId}=createUserDto;
    return this.usersService.create({email,firstName,lastName,password,phoneNumber,source, status},organizationId);
  }

  @Get('count')
  count() {
    return this.usersService.getCount();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('update')
  async update(@User() user: any, @Body() updateUserDto: UpdateUserDto) {
    const {firstName,lastName} = updateUserDto;
    const updatedDetails = await this.usersService.update(user.id, {firstName, lastName});
    await user.reload();
    return updatedDetails;
  }

  @Patch('change_password')
  async changePassword(@User() user, @Body() changePasswordDto: ChangePasswordDto) {
    return await this.usersService.update(user.id, {
      password: changePasswordDto.newPassword,
    });
  }
}
