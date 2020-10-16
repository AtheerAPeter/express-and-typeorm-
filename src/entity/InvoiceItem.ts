import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany} from "typeorm";
import { Invoice } from "./Invoice";
import { Product } from "./Product";

@Entity()
export class InvoiceItem {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type=> Invoice, invoice=> invoice.invoiceItems)
    invoice: Invoice;

    
@OneToMany(type=> Product, product=> product.invoiceItem)
products: Product[];
  
}
