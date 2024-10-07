import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { MailService, SmsService } from '../common/common.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, AuthService, JwtService, MailService, SmsService],
  imports:[
    TypeOrmModule.forFeature([Category, Product, User]),
    PassportModule.register({defaultStrategy:'jwt'})
  ],
})
export class BrandsModule {}
