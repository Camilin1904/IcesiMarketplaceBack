import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Product } from 'src/products/entities/product.entity';
import { Product_Category } from './entities/product_category.entity';
import { Category_Subscription }from './entities/category_subscription.entity';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports:[
    TypeOrmModule.forFeature([Category, Product, Product_Category, Category_Subscription]),
  ],
})
export class BrandsModule {}
