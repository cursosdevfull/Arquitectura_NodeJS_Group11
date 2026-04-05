import { DataSource } from 'typeorm';
import { CourseEntity } from '@courses/adapters';

export const courseProviders = [
  {
    provide: 'COURSE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CourseEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];
