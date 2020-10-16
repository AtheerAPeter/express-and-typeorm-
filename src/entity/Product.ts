import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany} from "typeorm";
import { Category } from "./Category";
import { InvoiceItem } from "./InvoiceItem";

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id: number;
   
    @Column()
    name: string;

    @Column({type: "float"})
    price: number;

    @Column({nullable: true})
    image: string;

    @Column({nullable:true})
    description: string;

    @Column()
    active: boolean;

    @ManyToOne(type=> InvoiceItem, invoiceitem=> invoiceitem.products)
    invoiceItem: Product;

    @ManyToOne(type=> Category, category=> category.products)
    category: Category;

}
