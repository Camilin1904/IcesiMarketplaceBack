import {IsPhoneNumber, IsString } from "class-validator";

export class SellerDto{
    @IsString()
    @IsPhoneNumber('CO', {message: 'Ingrese un número válido para Colombia'})
    phone: string;
    @IsString()
    location: string
}