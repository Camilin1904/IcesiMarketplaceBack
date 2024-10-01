import { User } from "src/auth/entities/user.entity";
import { Category } from "src/categories/entities/category.entity";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from "typeorm";



@Entity()
export class Category_Subscription {  
    
    @ManyToOne(()=>User,(user)=>user.categories_subscribed)
    user: User;

    @ManyToOne(()=>Category,(category)=>category.subscribers)
    category: Category;


}
