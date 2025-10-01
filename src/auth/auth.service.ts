import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LogInDto } from './dto/log-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) { }

  async signUp(signUpDto: SignUpDto): Promise<User> {
    return await this.usersService.create(signUpDto);
  }

  async logIn(logInDto: LogInDto): Promise<User> {
    const user: User = await this.usersService.findOneByEmail(logInDto.email);

    if (user.password !== logInDto.password) throw new UnauthorizedException('Invalid password!');

    return user;
  }
}
