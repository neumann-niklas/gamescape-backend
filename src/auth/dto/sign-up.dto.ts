import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignUpDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly firstName: string;

    @IsNotEmpty()
    @IsString()
    readonly lastName: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string;
}
