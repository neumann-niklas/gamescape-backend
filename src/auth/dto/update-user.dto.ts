import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly firstName?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly lastName?: string;
}

export class UpdateEmailDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;
}

export class UpdatePasswordDto {
    @IsNotEmpty()
    @IsString()
    readonly password: string;
}
