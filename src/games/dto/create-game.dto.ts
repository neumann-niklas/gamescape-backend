import { IsNotEmpty, IsString } from "class-validator";

export class CreateGameDto {
    @IsNotEmpty()
    @IsString()
    readonly title: string;
}
