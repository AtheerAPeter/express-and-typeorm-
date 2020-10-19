import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  BaseEntity,
} from "typeorm";
import { Invoice } from "./Invoice";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  otp: number;

  @Column()
  active: boolean;

  @Column()
  complete: boolean;

  //timestamp

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @CreateDateColumn()
  updatedAt: Date;

  // --------------------------relations-------------------------//

  @OneToMany((type) => Invoice, (invoice) => invoice.user)
  invoices: Invoice[];
}
