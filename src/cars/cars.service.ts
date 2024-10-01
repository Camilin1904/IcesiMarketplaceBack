/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import {v4 as uuid} from 'uuid'
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { Repository } from 'typeorm';
import { Brand } from 'src/brands/entities/brand.entity';
import { BrandsService } from 'src/brands/brands.service';



@Injectable()
export class CarsService {
    constructor (@InjectRepository(Car) private readonly cars:Repository<Car>, private readonly brandService:BrandsService){}

    async findById(id: string){
        const car= await this.cars.findOneBy({id:id});
        if(car==undefined){
            throw new NotFoundException();
        }
        return car;
    }
    async findAll(){
        return this.cars.find();
    }

    async create(car:CreateCarDto){
        const brand:Brand = await this.brandService.findOne(car.brand);
        const newCar:Car = {id:uuid(),brand:brand, model:car.model,year:car.year};
        this.cars.save(newCar);
        return newCar;
    }

    delete(id: string): Car{
        const car=this.delete(id);        
        return car;
    }

    async update(id:string, car: UpdateCarDto){
        const carUpdate = this.findById(id);
        Object.assign(carUpdate, car);
        return carUpdate;
    }
}
