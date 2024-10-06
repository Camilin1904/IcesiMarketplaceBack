import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Product } from "src/products/entities/product.entity";
import { Category } from "src/categories/entities/category.entity";


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

    @Column('text', {nullable:true})
    phone:string;

    @Column('text', {nullable:true})
    location:string;

    @Column('text', {array:true, default:['user']})
    roles: string[];

    @Column('boolean',{default:true})
    isActive: boolean;

    @OneToMany(()=>Product, (product)=>product.owner)
    products:Product[]

    @ManyToMany(()=>Product, (product) => product.subscribers)
    product_subscriptions:Product[]

    @ManyToMany(()=>Category, (category) => category.subscribers)
    category_subscriptions:Category[]
}