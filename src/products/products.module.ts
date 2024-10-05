/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from './entities/product.entity';
import { CategoriesService } from 'src/categories/categories.service';

@Module({
    controllers:[ProductsController],
    providers: [ProductsService, CategoriesService],
    imports:[
        TypeOrmModule.forFeature([Category, Product]),
      ],
})
export class ProductsModule {


}
