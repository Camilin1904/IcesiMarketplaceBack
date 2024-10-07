import {IsString, IsUUID, } from "class-validator";

export class SubscribeProductDto{
    @IsString()
    @IsUUID()
    readonly productId: string;
}

