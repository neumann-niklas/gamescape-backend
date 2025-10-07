import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const [type, accessToken]: string = request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !accessToken) throw new UnauthorizedException();

    try {
      request.payload = await this.jwtService.verifyAsync<User>(accessToken);
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
