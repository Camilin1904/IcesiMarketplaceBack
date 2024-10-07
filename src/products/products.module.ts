/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { Product } from './entities/product.entity';
import { CategoriesService } from '../categories/categories.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailService, SmsService } from '../common/common.service';

@Module({
    controllers:[ProductsController],
    providers: [ProductsService, CategoriesService, AuthService, JwtService, MailService, SmsService],
    imports:[
        TypeOrmModule.forFeature([Category, Product, User]),
        PassportModule.register({defaultStrategy:'jwt'})
      ],
})
export class ProductsModule {


}
