import { UserEntity } from '@users/adapters';
import { DataSource } from 'typeorm';

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];
