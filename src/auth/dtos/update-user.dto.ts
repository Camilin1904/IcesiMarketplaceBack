import { IsOptional, IsPhoneNumber, IsString, Matches } from "class-validator";

export class UpdateUserDto{
    @IsOptional()
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {message: 'La contraseña es muy débil o tiene caracteres especiales'})
    password:string;
    @IsString()
    @IsOptional()
    name:string;
    @IsOptional()
    @IsString()
    @IsPhoneNumber('CO', {message: 'Ingrese un número válido para Colombia'})
    phone: string;
    @IsOptional()
    @IsString()
    location: string
}