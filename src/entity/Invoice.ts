import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import { InvoiceItem } from "./InvoiceItem";
import { User } from "./User";

@Entity()
export class Invoice {
    static invoiceItems(arg0: (type: any) => typeof Invoice, invoiceItems: any) {
        throw new Error("Method not implemented.");
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "float"})
    total: number;

    @Column()
    address: string;

    @Column()
    status: string;

    @Column()
    method: string;

    @Column({type: "float"})
    long: number;

    @Column({type: "float"})
    lat: number;

    @ManyToOne(type=> User, user=> user.invoices)
    user: User;

    @OneToMany(type=> InvoiceItem, InvoiceItem=> InvoiceItem.invoice)
    invoiceItems: InvoiceItem[];
    

}
