import { Column } from 'typeorm';

export abstract class BaseEntity {
  @Column({ type: 'bool', default: true })
  isActive!: boolean;
}
