import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Car } from 'src/cars/entities/car.entity';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService],
  imports:[
    TypeOrmModule.forFeature([Brand, Car]),
  ],
})
export class BrandsModule {}
