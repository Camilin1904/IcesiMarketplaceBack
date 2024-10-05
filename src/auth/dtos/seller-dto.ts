import {IsPhoneNumber, IsString } from "class-validator";

export class SellerDto{
    @IsString()
    @IsPhoneNumber()
    phone: string;
    @IsString()
    location: string
}