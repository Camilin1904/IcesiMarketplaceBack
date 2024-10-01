import { IsInt, IsOptional, IsString, isString, IsUUID, Max, Min } from "class-validator";

export class UpdateCarDto{

    @IsUUID()
    @IsOptional()
    readonly id:string;
    @IsString()
    @IsOptional()
    readonly brand: string;
    @IsString()
    @IsOptional()
    readonly model: string;
    @IsInt()
    @IsOptional()
    @Min(1990)
    @Max(2100)
    readonly year: number;
}
