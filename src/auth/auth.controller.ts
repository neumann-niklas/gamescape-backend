import { Body, Controller, Delete, Get, HttpCode, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { UpdateEmailDto, UpdatePasswordDto, UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/log-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) { }

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<string> {
    return await this.authService.signUp(signUpDto);
  }

  @Post('login')
  @HttpCode(200)
  async logIn(@Body() logInDto: LogInDto): Promise<string> {
    return await this.authService.logIn(logInDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getUser(@Request() { payload }): Promise<User> {
    return await this.usersService.findOne(payload.sub);
  }

  @UseGuards(AuthGuard)
  @Patch()
  async update(@Request() { payload }, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.usersService.update(payload.sub, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Patch('email')
  async updateEmail(@Request() { payload }, @Body() updateEmailDto: UpdateEmailDto): Promise<User> {
    return await this.usersService.updateEmail(payload.sub, updateEmailDto);
  }

  @UseGuards(AuthGuard)
  @Patch('password')
  async updatePassword(@Request() { payload }, @Body() updatePasswordDto: UpdatePasswordDto): Promise<User> {
    return await this.usersService.updatePassword(payload.sub, updatePasswordDto);
  }

  @UseGuards(AuthGuard)
  @Delete()
  async remove(@Request() { payload }): Promise<User> {
    return await this.usersService.remove(payload.sub);
  }
}
