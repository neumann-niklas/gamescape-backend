import { Body, Controller, Delete, Get, HttpCode, Patch, Post } from '@nestjs/common';
import { UpdateEmailDto, UpdatePasswordDto, UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { UserId } from './decorators/user-id.decorator';
import { LogInDto } from './dto/log-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) { }

  @Public()
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ readonly accessToken: string }> {
    return await this.authService.signUp(signUpDto);
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  async logIn(@Body() logInDto: LogInDto): Promise<{ readonly accessToken: string }> {
    return await this.authService.logIn(logInDto);
  }

  @Get()
  async getUser(@UserId() userId: string): Promise<User> {
    return await this.usersService.findOne(userId);
  }

  @Patch()
  async update(@UserId() userId: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.usersService.update(userId, updateUserDto);
  }

  @Patch('email')
  async updateEmail(@UserId() userId: string, @Body() updateEmailDto: UpdateEmailDto): Promise<User> {
    return await this.usersService.updateEmail(userId, updateEmailDto);
  }

  @Patch('password')
  async updatePassword(@UserId() userId: string, @Body() updatePasswordDto: UpdatePasswordDto): Promise<User> {
    return await this.usersService.updatePassword(userId, updatePasswordDto);
  }

  @Delete()
  async remove(@UserId() userId: string): Promise<User> {
    return await this.usersService.remove(userId);
  }
}
