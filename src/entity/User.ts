import { type } from "os";
import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Invoice } from "./Invoice";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    phone: string;

    @Column()
    password: string;

    @Column()
    active: boolean;

    @Column()
    complete: boolean;


    @OneToMany((type)=> Invoice, (invoice)=> invoice.user)
    invoices: Invoice[];

}
