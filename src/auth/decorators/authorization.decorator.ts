import { SetMetadata } from "@nestjs/common";
import { Role } from "../enums/role.enum";

export const ROLE_KEY: string = 'role';
export const Authorization = (role: Role) => SetMetadata(ROLE_KEY, role);
