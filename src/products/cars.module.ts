/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from './entities/product.entity';
import { BrandsService } from 'src/categories/brands.service';
import { Product_Subscription } from 'src/products/entities/product_subscription.entity';

@Module({
    controllers:[CarsController],
    providers: [CarsService, BrandsService],
    imports:[
        TypeOrmModule.forFeature([Category, Product, Product_Subscription]),
      ],
})
export class CarsModule {


}
