import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}
    @Post('register')
    createUser(@Body() creatUserDto:CreateUserDto){

        return this.authService.createUser(creatUserDto);
    }

    @Post('login')
    loginUser(@Body() loginUserDto: LoginUserDto){
        return this.authService.loginUser(loginUserDto);
    }

    @Get('protected1')
    @UseGuards(AuthGuard())
    protected1(){
        return 'This is a protected route';
    }

}
