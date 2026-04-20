import { DatabaseModule } from '@core/modules/database';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserAdapter, userProviders } from '@users/adapters';
import { UserApplication } from '@users/application';
import { UserController } from '@users/presentation';

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
    ...userProviders,
    UserApplication,
    {
      provide: 'USER_PORT',
      useClass: UserAdapter,
    },
    {
      provide: 'USER_USE_CASE_PORT',
      useClass: UserApplication,
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
