import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private readonly userRepository:Repository<User>, private readonly jwtService: JwtService){}

    async createUser(createUserDto: CreateUserDto){
        try{
            const {password, ...userData} = createUserDto;
            const user = this.userRepository.create({
                password : bcrypt.hashSync(password,10),
                ...userData})
            await this.userRepository.save(user);
            return user;
        }
        catch(e){
            console.log(e);
        }
    }

    async loginUser(loginUserDto:LoginUserDto){
        const {email, password} = loginUserDto;
        const user = await this.userRepository.findOne({where:{email}, select: ['id','email','password']});

        if(!user || !bcrypt.compareSync(password, user.password))
            throw new UnauthorizedException('Invalid Credentials');

        return {user_id: user.id, user_email:user.email, token: this.jwtService.sign({user_id: user.id})};
    }


}
/*function InjectableRepository(user: typeof User): (target: typeof AuthService, propertyKey: undefined, parameterIndex: 0) => void {
    throw new Error('Function not implemented.');
}*/

