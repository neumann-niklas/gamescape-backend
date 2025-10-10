import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { JwtConfigService } from './config/jwt-config.service';
import { TypeOrmConfigService } from './config/typeorm-config.service';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.registerAsync({ useClass: JwtConfigService }),
        TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
        AppRoutingModule
    ],
    providers: [{ provide: APP_GUARD, useClass: AuthGuard }]
})
export class AppModule { }
