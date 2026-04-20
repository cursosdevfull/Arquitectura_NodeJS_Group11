import { DatabaseModule } from '@core/modules/database';
import { RoleAdapter, roleProviders } from '@roles/adapters';
import { RoleApplication } from '@roles/application';
import { RoleController } from '@roles/presentation';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    CacheModule.registerAsync({
      useFactory: async (cs: ConfigService) => {
        const redisUrl = `redis://:${cs.get('redis.password')}@${cs.get('redis.host')}:${cs.get('redis.port')}`;
        return {
          stores: [
            new Keyv({
              store: new KeyvRedis(redisUrl),
            }),
          ],
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    ...roleProviders,
    RoleApplication,
    {
      provide: 'ROLE_PORT',
      useClass: RoleAdapter,
    },
    {
      provide: 'ROLE_USE_CASE_PORT',
      useClass: RoleApplication,
    },
  ],
  controllers: [RoleController],
})
export class RoleModule {}
