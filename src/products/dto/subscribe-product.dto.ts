import { ArrayMinSize, IsArray, IsInt, IsNumber, IsString, isString, IsUUID, Max, Min } from "class-validator";

export class SubscribeProductDto{
    @IsString()
    @IsUUID()
    readonly productId: string;
}

