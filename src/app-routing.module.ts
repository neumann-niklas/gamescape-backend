import { Module } from "@nestjs/common";
import { RouterModule, Routes } from "@nestjs/core";
import { UsersModule } from "./users/users.module";

const routes: Routes = [
    { path: 'users', module: UsersModule }
];

@Module({
    imports: [
        RouterModule.register(routes),
        UsersModule
    ]
})
export class AppRoutingModule { }
