
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, 
    @InjectRepository(User) private readonly userRepository: Repository<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const id = payload.user_id;
    const user = await this.userRepository.findOneBy({id})
    if(!user){
        throw new UnauthorizedException('Invalid token')
    }
    if(!user.isActive){
        throw new UnauthorizedException('Invalid user')
    }
    return { userId: payload.user_id};
  }
}
