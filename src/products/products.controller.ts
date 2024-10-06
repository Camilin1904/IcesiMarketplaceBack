/* eslint-disable prettier/prettier */
import { Controller, Get, Post,Param, ParseIntPipe, Body, ValidationPipe, UsePipes, ParseUUIDPipe, Delete, Patch, Request, UseGuards  } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SubscribeProductDto } from './dto/subscribe-product.dto';
import { Auth } from '../../src/auth/decorators/auth.decorator';

@Controller('products')
export class ProductsController {

    constructor(public readonly productsService:ProductsService){}

    @Get()
    async findAll(){
        return this.productsService.findAll();  
    }
    
    @Auth()      
    @Post('subscribe')
    subscribe(@Request() req, @Body() subscribeProductDto:SubscribeProductDto){
        return this.productsService.subscribe(subscribeProductDto,req.user.id)
    }
    
    @Post()
    @UsePipes(ValidationPipe)
    @Auth()      
    async create(@Request() req, @Body() car:CreateProductDto){
        const uId:string = req.user.id;
        return this.productsService.create(car, uId);
    }

    @Get('category/:id')
    findByCategory(@Param('id', ParseUUIDPipe) categoryId:string){
        return this.productsService.findByCategory(categoryId);
    }

    @Get(':id')
    async findById(@Param('id', ParseUUIDPipe)id :string){
        return this.productsService.findById(id);
    }

    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe)id :string){
        return this.productsService.delete(id);
    }

    @Patch(':id')
    update(@Param('id', ParseUUIDPipe) id:string, @Body() body:UpdateProductDto){
        return this.productsService.update(id,body);
    }

    

}
