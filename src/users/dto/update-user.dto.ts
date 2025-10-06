import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    readonly firstName?: string;

    @IsOptional()
    @IsString()
    readonly lastName?: string;
}

export class UpdateUserEmailDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;
}

export class UpdateUserPasswordDto {
    @IsNotEmpty()
    @IsString()
    readonly password: string;
}
