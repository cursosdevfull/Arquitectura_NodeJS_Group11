import { ConsoleLogger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyOwnLogger } from './my-logger';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    //logger: new MyOwnLogger(),
    //logger: console,
    /*logger: new ConsoleLogger({
      colors: true,
      timestamp: true,
      prefix: 'AppLogger',
      //json: true,
    }),*/
  });
  app.useLogger(app.get(Logger));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
