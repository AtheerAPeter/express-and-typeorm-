import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  BaseEntity,
} from "typeorm";
import { InvoiceItem } from "./InvoiceItem";
import { User } from "./User";

@Entity()
export class Invoice extends BaseEntity {
  static invoiceItems(arg0: (type: any) => typeof Invoice, invoiceItems: any) {
    throw new Error("Method not implemented.");
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "float" })
  total: number;

  @Column()
  address: string;

  @Column()
  status: string;

  @Column()
  method: string;

  @Column()
  long: string;

  @Column()
  lat: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @CreateDateColumn()
  updatedAt: Date;

  //------------------relations------------------------//

  @ManyToOne((type) => User, (user) => user.invoices)
  user: User;

  @OneToMany((type) => InvoiceItem, (InvoiceItem) => InvoiceItem.invoice)
  invoiceItems: InvoiceItem[];
}
