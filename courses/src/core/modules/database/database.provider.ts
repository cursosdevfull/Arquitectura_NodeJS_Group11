import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (cs: ConfigService) => {
      const options: DataSourceOptions = {
        type: 'mysql',
        host: cs.get<string>('database.host'),
        port: cs.get<number>('database.port'),
        username: cs.get<string>('database.user'),
        password: cs.get<string>('database.password'),
        database: cs.get<string>('database.name'),
        synchronize: cs.get<boolean>('database.synchronize'),
        logging: cs.get<boolean>('database.logging'),
        entities: [
          __dirname + '/../../../features/**/adapters/*.entity{.ts,.js}',
        ],
      };

      console.log('Database connection options:', options);

      const dataSource = new DataSource(options);

      return dataSource.initialize();
    },
    inject: [ConfigService],
  },
];
