import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions, JwtOptionsFactory } from "@nestjs/jwt";

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
    constructor(private readonly configService: ConfigService) { }

    createJwtOptions(): JwtModuleOptions {
        return {
            global: true,
            secret: this.configService.get<string>('JWT_SECRET')
        };
    }
}
