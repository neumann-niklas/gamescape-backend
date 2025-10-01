import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/email')
  async updateEmail(@Param('id', ParseUUIDPipe) id: string, @Body() email: string): Promise<User> {
    return await this.usersService.updateEmail(id, email);
  }

  @Patch(':id/password')
  async updatePassword(@Param('id', ParseUUIDPipe) id: string, @Body() password: string): Promise<User> {
    return await this.usersService.updatePassword(id, password);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return await this.usersService.remove(id);
  }
}
