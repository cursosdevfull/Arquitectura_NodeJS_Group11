import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AreaEntity } from "./area.entity";
import { UserEntity } from "./user.entity";

@Entity({ name: "roles" })
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[];

  @ManyToOne(() => AreaEntity, (area) => area.roles)
  @JoinColumn({ name: "area_id" })
  area: AreaEntity;
}
