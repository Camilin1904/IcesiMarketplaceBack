import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Product } from "../../products/entities/product.entity";
import { Category } from "../../categories/entities/category.entity";


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

    @Column('timestamp',{default: new Date(0)})
    lastNotified: Date;
}