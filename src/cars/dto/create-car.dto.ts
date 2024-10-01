import { IsInt, IsString, isString, Max, Min } from "class-validator";

export class CreateCarDto{
    @IsString()
    readonly brand: string;
    @IsString()
    readonly model: string;
    @IsInt()
    @Min(1990)
    @Max(2100)
    readonly year: number;
}
