import { User } from "src/auth/entities/user.entity";
import { Product } from "src/products/entities/product.entity";
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id:string;
    // Nombre
    @Column('text', {unique:true})
    name:string;
    // Descripción
    @Column('text', {unique:false})
    description:string;
    // slug
    @Column('text', {unique:true})
    slug:string;    
    
    // Un producto tiene muchas categorías y una categoría tiene muchos productos
    @ManyToMany(()=>Product, (product) => product.categories)
    @JoinTable()
    products:Product[];

    // Un usuario puede suscribirse a muchas categorías y una categoría puede tener suscritos muchos usuarios
    @ManyToMany(()=>User, (user) => user.category_subscriptions)
    @JoinTable()
    subscribers: User[];

    @BeforeInsert()
    checkSlug():void{
        if(!this.slug){
            this.slug = this.name; 
        }
    }
}
