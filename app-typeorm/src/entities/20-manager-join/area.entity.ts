import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoleEntity } from "./role.entity";

@Entity({ name: "areas" })
export class AreaEntity {
  @PrimaryGeneratedColumn()
  id: number;

    @Column({ type: "varchar", length: 255 })
    name: string;   

    @OneToMany(() => RoleEntity, role => role.area)
    roles: RoleEntity[];
}