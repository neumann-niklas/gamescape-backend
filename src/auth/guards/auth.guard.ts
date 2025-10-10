import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), context.getClass()
    ])) return true;

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
