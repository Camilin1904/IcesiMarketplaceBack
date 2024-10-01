import { IsEmail, IsString, Matches } from "class-validator";

export class CreateUserDto{
    @IsString()
    @IsEmail()
    email: string;
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {message: 'Password too weak'})
    password:string;
    @IsString()
    name:string;
}