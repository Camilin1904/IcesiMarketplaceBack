/* eslint-disable prettier/prettier */
import { Controller, Get, Post,Param, ParseIntPipe, Body, ValidationPipe, UsePipes, ParseUUIDPipe, Delete, Patch  } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Controller('cars')
export class CarsController {

    constructor(public readonly carsService:CarsService){}

    @Get()
    async findAll(){
        return this.carsService.findAll();
    }

    @Post()
    @UsePipes(ValidationPipe)
    async crate(@Body() car:CreateCarDto){
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
    update(@Param('id', ParseUUIDPipe) id:string, @Body() body:UpdateCarDto){
        return this.carsService.update(id,body);
    }

}
