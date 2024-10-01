import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { Product_Category } from "src/categories/entities/product_category.entity";
import { User } from "src/auth/entities/user.entity";

@Entity()
export class Product{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('float')
    cost: number;

    @Column('boolean')
    inStock: boolean;

    @Column('text')
    description: string;

    @OneToMany(()=>Product_Category, (product_category)=>product_category.product)
    categories:Product_Category;

    @ManyToOne(()=>User,(user)=>user.products)
    user: User;

    @OneToMany(()=>Product_Category, (product_category)=>product_category.product)
    subscribers:Product_Category;


}
