import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Product } from "src/products/entities/product.entity";
import { Product_Subscription } from "src/products/entities/product_subscription.entity";
import { Category_Subscription } from "src/categories/entities/category_subscription.entity";


@Entity('users')
export class User{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text', {unique:true})
    email: string;

    @Column('text', {select:false})
    password:string;

    @Column('text')
    name:string;

    @Column('text')
    phone:string;

    @Column('text')
    location:string;

    @Column('text', {array:true, default:['user']})
    roles: string[];

    @Column('boolean',{default:false})
    isActive: boolean;

    @OneToMany(()=>Product, (product)=>product.user)
    products:Product

    @OneToMany(()=>Product_Subscription, (product_subscription)=>product_subscription.user)
    products_subscribed:Product_Subscription


    @OneToMany(()=>Category_Subscription, (categories_subscription)=>categories_subscription.user)
    categories_subscribed:Category_Subscription
}