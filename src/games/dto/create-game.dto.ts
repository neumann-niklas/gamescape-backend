import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Category } from "src/categories/entities/category.entity";
import { GroupPhase } from "../enums/group-phase.enum";

export class CreateGameDto {
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsOptional()
    @IsEnum(GroupPhase)
    readonly groupPhase?: GroupPhase = GroupPhase.Forming;

    @IsOptional()
    readonly categories?: Category[];
}
