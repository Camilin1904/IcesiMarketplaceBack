/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import {v4 as uuid} from 'uuid'
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { CategoriesService } from 'src/categories/categories.service';



@Injectable()
export class ProductsService {
    constructor (@InjectRepository(Product) private readonly products:Repository<Car>, private readonly categoriesService:CategoriesService){}

    async findById(id: string){
        const car= await this.products.findOneBy({id:id});
        if(car==undefined){
            throw new NotFoundException();
        }
        return car;
    }
    async findAll(){
        return this.products.find();
    }
    /*
    async create(car:CreateProductDto){
        const category:Category = await this.categoriesService.findOne(car.category);
        const newCar:Car = {id:uuid(),category:category, model:car.model,year:car.year};
        this.products.save(newCar);
        return newCar;
    }
        */

    delete(id: string): Car{
        const car=this.delete(id);        
        return car;
    }

    async update(id:string, car: UpdateProductDto){
        const carUpdate = this.findById(id);
        Object.assign(carUpdate, car);
        return carUpdate;
    }

    
}
