import { User } from "src/auth/entities/user.entity";
import { Product } from 'src/products/entities/product.entity';
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from "typeorm";


@Entity()
export class Product_Subscription{  
    
    @ManyToOne(()=>Product,(product)=>product.subscribers)
    product: Product;

    @ManyToOne(()=>User,(user)=>user.products_subscribed)
    user: User;


}
