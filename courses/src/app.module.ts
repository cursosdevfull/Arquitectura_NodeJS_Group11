import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configEnv } from './core/configuration/config-env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configEnv],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
