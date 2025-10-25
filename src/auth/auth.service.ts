import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LogInDto } from './dto/log-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) { }

  async signUp(signUpDto: SignUpDto): Promise<{ readonly accessToken: string }> {
    const user: User = await this.usersService.create({
      ...signUpDto,
      password: await hash(signUpDto.password, await genSalt())
    });

    return { accessToken: await this.jwtService.signAsync({ sub: user.id, role: user.role }) };
  }

  async logIn(logInDto: LogInDto): Promise<{ readonly accessToken: string }> {
    const user: User = await this.usersService.findOneByEmail(logInDto.email);

    if (!await compare(logInDto.password, user.password)) throw new UnauthorizedException('Invalid password!');

    return { accessToken: await this.jwtService.signAsync({ sub: user.id, role: user.role }) };
  }
}
