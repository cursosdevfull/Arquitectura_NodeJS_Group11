import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  console.log("PORT", process.env.PORT);
  const app = await NestFactory.create(AppModule);

  const service = app.get(ConfigService)
  const port = service.get<number>('PORT') || 3000;
  console.log("PORT", port);

  //await app.listen(process.env.PORT ?? 3000);
  await app.listen(port)
}
bootstrap();
