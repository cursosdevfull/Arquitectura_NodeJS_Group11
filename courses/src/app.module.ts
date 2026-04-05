import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configEnv } from './core/configuration/config-env';
import { DatabaseModule } from './core/modules/database/database.module';
import { CourseModule } from './features/courses/presentation/course.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configEnv],
    }),
    CourseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
