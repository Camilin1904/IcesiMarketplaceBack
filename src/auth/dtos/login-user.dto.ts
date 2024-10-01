import { IsEmail, IsString, Matches } from "class-validator";

export class LoginUserDto{
    @IsString()
    @IsEmail()
    email: string;
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {message: 'Password too weak'})
    password:string;
}