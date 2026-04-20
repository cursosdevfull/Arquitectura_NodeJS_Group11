import { REQUEST_ID_HEADER, RequestIdMiddleware } from '@core/middlewares';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager/dist/cache.module';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RoleModule } from '@roles/presentation';
import { UserModule } from '@users/presentation';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configEnv } from './core/configuration/config-env';
import { CourseModule } from './features/courses/presentation/course.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configEnv],
    }),
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
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport:
          process.env.NODE_ENV === 'production'
            ? undefined
            : {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  levelFirst: true,
                  translateTime: 'yyyy-mm-dd HH:MM:ss',
                },
              },
        genReqId(req: any, res: any) {
          const id = (req.headers[REQUEST_ID_HEADER] as string) ?? randomUUID();
          req.headers[REQUEST_ID_HEADER] = id;
          res.setHeader(REQUEST_ID_HEADER, id);
          return id;
        },
        customAttributeKeys: {
          reqId: 'requestId',
        },
        autoLogging: true,
        serializers: {
          req: (req: any) => {
            return {
              method: req.method,
              url: req.url,
              headers: req.headers,
              params: req.params,
              query: req.query,
              body: req.body,
            };
          },
          res: (res: any) => {
            return {
              statusCode: res.statusCode,
              headers: res.headers,
            };
          },
        },
        customSuccessObject(req, res, val) {
          return {
            ...val,
            responseBody: (res as any).body,
          };
        },
      },
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    CourseModule,
    RoleModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
