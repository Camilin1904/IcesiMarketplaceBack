import { Category_Subscription } from "./category_subscription.entity";
import { Product_Category } from "./product_category.entity";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text', {unique:true})
    name:string;

    @Column('text', {unique:false})
    descripton:string;

    @Column('text', {unique:true})
    slug:string;    
    
    @OneToMany(()=>Product_Category, (product_category)=>product_category.category)
    products:Product_Category;

    @OneToMany(()=>Category_Subscription, (categories_subscription)=>categories_subscription.category)
    subscribers:Category_Subscription;

    @BeforeInsert()
    checkSlug():void{
        if(!this.slug){
            this.slug = this.name; 
        }
    }
}
