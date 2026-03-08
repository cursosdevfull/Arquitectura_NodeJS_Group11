import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  REQUEST_ID_HEADER,
  RequestIdMiddleware,
} from './middleware/request-id';

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
