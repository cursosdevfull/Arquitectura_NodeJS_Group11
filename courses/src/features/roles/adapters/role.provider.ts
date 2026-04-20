import { DataSource } from 'typeorm';
import { RoleEntity } from '@roles/adapters';

export const roleProviders = [
  {
    provide: 'ROLE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RoleEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];
