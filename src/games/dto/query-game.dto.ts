import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { GroupPhase } from "../enums/group-phase.enum";

export class QueryGameDto {
    @IsOptional()
    @IsString()
    readonly search?: string;

    @IsOptional()
    @IsEnum(GroupPhase)
    @Type(() => Number)
    readonly groupPhase?: GroupPhase;

    @IsOptional()
    @IsUUID()
    readonly categoryId?: string;

    @IsOptional()
    @IsString()
    readonly sortBy?: 'title' | 'groupPhase' | 'updateDate';

    @IsOptional()
    @IsString()
    readonly sortOrder?: 'ASC' | 'DESC';
}
