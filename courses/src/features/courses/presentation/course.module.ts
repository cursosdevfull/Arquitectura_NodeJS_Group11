import { DatabaseModule } from '@core/modules/database';
import { CourseAdapter, courseProviders } from '@courses/adapters';
import { CourseApplication } from '@courses/application';
import { CourseController } from '@courses/presentation';
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
    ...courseProviders,
    CourseApplication,
    {
      provide: 'COURSE_PORT',
      useClass: CourseAdapter,
    },
    {
      provide: 'COURSE_USE_CASE_PORT',
      useClass: CourseApplication,
    },
  ],
  controllers: [CourseController],
})
export class CourseModule {}
