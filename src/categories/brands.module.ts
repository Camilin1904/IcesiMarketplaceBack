import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Product } from 'src/products/entities/product.entity';
import { Product_Category } from './entities/product_category.entity';
import { Category_Subscription }from './entities/category_subscription.entity';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService],
  imports:[
    TypeOrmModule.forFeature([Category, Product, Product_Category, Category_Subscription]),
  ],
})
export class BrandsModule {}
