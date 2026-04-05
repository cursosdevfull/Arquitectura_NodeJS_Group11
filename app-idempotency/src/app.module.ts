import KeyvRedis, { Keyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
/*   imports: [CacheModule.register({
      ttl: 10000, // seconds
  })], */
  imports: [CacheModule.registerAsync({
    useFactory: async () => {
      return {
        stores: [
/*           new Keyv({
            store: new CacheableMemory({
              ttl: 10000
            })
          }), */
          new Keyv({
            store: new KeyvRedis("redis://localhost:6379"),
            ttl: 10000
          })
        ]
      }
    }
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
