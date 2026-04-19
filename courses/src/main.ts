import { GlobalException } from '@core/exceptions/global.exception';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
    }),
  );

  app.useGlobalFilters(new GlobalException());

  const configService = app.get(ConfigService);
  console.log(
    `Starting server on port ${configService.get<number>('port') ?? 3000}...`,
  );

  await app.listen(configService.get<number>('port') ?? 3000);
}
bootstrap();
