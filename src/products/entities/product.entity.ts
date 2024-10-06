import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm"
import { User } from "src/auth/entities/user.entity";
import { Category } from "src/categories/entities/category.entity";

@Entity()
export class Product{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('float')
        cost: number;

    @Column('boolean',{default:true})
    inStock: boolean;

    @Column('text')
    description: string;

    // Un producto tiene muchas categorías y una categoría tiene muchos productos
    @ManyToMany(()=>Category, (category) => category.products, {cascade:true})
    categories:Category[];

    // Un usario vende muchos productos
    @ManyToOne(()=>User, (user) => user.products,{cascade:true})
    owner: User

    // Un producto puede haber sido comprado por muchos usuarios y un usuario puede haber comprado muchos productos
    @ManyToMany(() => User, (user) => user.bought, {nullable:true, cascade:true})
    @JoinTable()
    bought: User[]

    //@OneToMany(()=>Product_Category, (product_category)=>product_category.product)
    //subscribers:Product_Category;

}
