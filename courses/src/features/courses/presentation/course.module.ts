import { DatabaseModule } from '@core/modules/database';
import { CourseAdapter, courseProviders } from '@courses/adapters';
import { CourseApplication } from '@courses/application';
import { CourseController } from '@courses/presentation';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
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
