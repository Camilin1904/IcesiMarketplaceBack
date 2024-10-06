/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from './entities/product.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
    controllers:[ProductsController],
    providers: [ProductsService, CategoriesService, AuthService, JwtService],
    imports:[
        TypeOrmModule.forFeature([Category, Product, User]),
      ],
})
export class ProductsModule {


}
