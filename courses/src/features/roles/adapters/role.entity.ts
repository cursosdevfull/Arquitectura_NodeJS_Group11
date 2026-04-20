import { BaseEntity } from '@core/base';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'role' })
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  roleId!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;
}
