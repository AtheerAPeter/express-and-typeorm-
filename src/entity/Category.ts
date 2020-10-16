import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Product } from "./Product";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    icon: string;

    @Column({unique: true, nullable: true})
    active: boolean;

  @OneToMany(type=> Product, product=> product.category)
  products: Product[]
}
