/* eslint-disable prettier/prettier */
import { Controller, Get, Post,Param, ParseIntPipe, Body, ValidationPipe, UsePipes, ParseUUIDPipe, Delete, Patch  } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('cars')
export class ProductsController {

    constructor(public readonly carsService:ProductsService){}

    @Get()
    async findAll(){
        return this.carsService.findAll();
    }

    @Post()
    @UsePipes(ValidationPipe)
    async create(@Body() car:CreateProductDto){
        return this.carsService.create(car);
    }

    @Get(':id')
    async findById(@Param('id', ParseUUIDPipe)id :string){
        return this.carsService.findById(id);
    }

    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe)id :string){
        return this.carsService.delete(id);
    }

    @Patch(':id')
    update(@Param('id', ParseUUIDPipe) id:string, @Body() body:UpdateProductDto){
        return this.carsService.update(id,body);
    }

}
