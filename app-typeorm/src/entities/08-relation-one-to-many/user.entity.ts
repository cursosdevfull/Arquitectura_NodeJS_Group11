import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RoleEntity } from "./role.entity";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255 })
  email: string;

  @Column({ type: "int" })
  age: number;

  @Column({ type: "bool", default: true })
  active: boolean;

  @ManyToOne(() => RoleEntity, (role) => role.users, { cascade: true })
  @JoinColumn({ name: "role" })
  role: RoleEntity;
}
