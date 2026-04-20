import { BaseEntity } from '@core/base';
import { RoleEntity } from '@roles/adapters';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  userId!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column()
  roleId!: number;

  @ManyToOne(() => RoleEntity)
  @JoinColumn({ name: 'roleId' })
  role!: RoleEntity;
}
