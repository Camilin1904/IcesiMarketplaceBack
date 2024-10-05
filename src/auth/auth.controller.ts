import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { SellerDto } from './dtos/seller-dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}
    @Post('register')
    createUser(@Body() creatUserDto: CreateUserDto){

        return this.authService.createUser(creatUserDto);
    }

    @Post('login')
    loginUser(@Body() loginUserDto: LoginUserDto){
        return this.authService.loginUser(loginUserDto);
    }

    @Post('seller')
    @UseGuards(AuthGuard('jwt')) // Protege la ruta con el guard de JWT
    becomeSeller(@Request() req, @Body() sellerDto: SellerDto) {
        const userId = req.user.id; // Obtén el user_id del JWT
        return this.authService.becomeSeller(userId, sellerDto);
    }

    @Get('info')
    @UseGuards(AuthGuard('jwt')) // Protege la ruta con el guard de JWT
    myInfo(@Request() req) {
        const userId = req.user.id; // Obtén el user_id del JWT
        return this.authService.myInfo(userId);
    }

}
