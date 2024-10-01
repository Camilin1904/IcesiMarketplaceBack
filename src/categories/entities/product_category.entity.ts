import { Product } from "src/products/entities/product.entity";
import { Category } from "src/categories/entities/category.entity";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from "typeorm";



@Entity()
export class Product_Category {  
    
    @ManyToOne(()=>Product,(product)=>product.categories)
    product: Product;

    @ManyToOne(()=>Category,(category)=>category.products)
    category: Category;


}
