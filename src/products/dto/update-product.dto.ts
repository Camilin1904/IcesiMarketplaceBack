import { ArrayMinSize, IsArray, IsInt, IsNumber, IsOptional, IsString, isString, IsUUID, Max, Min } from "class-validator";

export class UpdateProductDto{

    @IsUUID()
    @IsOptional()
    readonly id:string;
    @IsString()
    @IsOptional()
    readonly name: string;
    @IsNumber()
    @Min(0)
    @IsOptional()
    readonly cost: number;
    @IsString()
    @IsOptional()
    readonly description: string;
    @IsArray()
    @IsString({each:true})
    @ArrayMinSize(1)
    @IsOptional()
    readonly categories: string[]
}
