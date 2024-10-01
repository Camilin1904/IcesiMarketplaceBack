/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from 'src/brands/entities/brand.entity';
import { Car } from './entities/car.entity';
import { BrandsService } from 'src/brands/brands.service';

@Module({
    controllers:[CarsController],
    providers: [CarsService, BrandsService],
    imports:[
        TypeOrmModule.forFeature([Brand, Car]),
      ],
})
export class CarsModule {


}
