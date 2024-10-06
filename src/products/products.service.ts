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
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/entities/user.entity';
import { SubscribeProductDto } from './dto/subscribe-product.dto';



@Injectable()
export class ProductsService {
    constructor (@InjectRepository(Product) private readonly products:Repository<Product>, private readonly categoriesService:CategoriesService, private readonly authService:AuthService){}

    async findById(id: string){
        const product= await this.products.findOneBy({id:id});
        if(product==undefined){
            throw new NotFoundException();
        }
        return product;
    }
    async findAll(){
        return this.products.find();
    }
    
    async create(product:CreateProductDto, uId:string){
        const categoriesId:string[] = product.categories;
        var categories: Category[] = [];
        for (const cat of categoriesId){
            categories.push(await this.categoriesService.findOne(cat))
        }
        /*Promise.all(categoriesId.map(this.categoriesService.findOne))
            .then(
                cats =>{
                    categories = cats;
                }
            )*/
        const owner: User = await this.authService.myInfo(uId);
        const newProduct:Product = {
            id: uuid(), 
            categories: categories, 
            cost: product.cost, 
            description: product.description, 
            name: product.name,
            inStock: true,
            owner: owner,
            subscribers: []
        };
        this.products.save(newProduct);
        return newProduct;
    }
        

    async delete(id: string) {
        // First, find the product with its relations
        const product = await this.products.findOne({
          where: { id },
          relations: ['categories', 'bought'], // Include all relations that need to be cleared
        });
      
        if (!product) {
          throw new Error(`Product with ID ${id} not found`);
        }
      
        // Clear the relations before deleting the product
        product.categories = [];
        product.subscribers = [];
        await this.products.save(product);
      
        // Now delete the product
        const result = await this.products.delete(id);
        return result;
      }
      

    async update(id:string, product: UpdateProductDto){
        const productUpdate = await this.findById(id);
        Object.assign(productUpdate, product);
        this.products.save(productUpdate);
        return productUpdate;
    }

    async findByCategory(categoryId:string){
        const products = await this.products
        .createQueryBuilder('product')
        .innerJoinAndSelect('product.categories', 'category') // Join with the categories relation
        .where('category.id = :categoryId', { categoryId }) // Filter by category id
        .getMany();
        return products;

    }

    async subscribe(id:SubscribeProductDto, buyer: string){
        const product = await this.findById(id.productId);
        const user:User = await this.authService.myInfo(buyer);
        try{
            product.subscribers.push(user)
        }
        catch{
            product.subscribers = [user]
        }
        await this.products.save(product);

        return product;
    }
    

    
}
