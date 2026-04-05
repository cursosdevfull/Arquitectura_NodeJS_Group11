import { BaseEntity } from '@core/base';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'course' })
export class CourseEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  courseId!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;
}
