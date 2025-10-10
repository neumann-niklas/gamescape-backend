import { Module } from "@nestjs/common";
import { RouterModule, Routes } from "@nestjs/core";
import { AuthModule } from './auth/auth.module';
import { GamesModule } from './games/games.module';
import { UsersModule } from "./users/users.module";

const routes: Routes = [
    { path: 'auth', module: AuthModule },
    { path: 'games', module: GamesModule },
    { path: 'users', module: UsersModule }
];

@Module({
    imports: [
        RouterModule.register(routes),
        AuthModule,
        GamesModule,
        UsersModule
    ]
})
export class AppRoutingModule { }
