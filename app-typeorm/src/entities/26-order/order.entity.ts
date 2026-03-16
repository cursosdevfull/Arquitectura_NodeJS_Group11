import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "orders" })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  orderId: number;

  @Column({ type: "int" })
  customerId: number;

  @Column({ type: "varchar", length: 100 })
  product: string;

  @Column({ type: "int" })
  quantity: number;

  @Column({ type: "float" })
  price: number;
}
