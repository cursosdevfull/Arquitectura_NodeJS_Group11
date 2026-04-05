import { ResultPage } from '@core/responses';
import { Course, CoursePropsUpdate } from '@courses/domain';
import { type CoursePort, CourseUseCasePort } from '@courses/ports';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class CourseApplication implements CourseUseCasePort {
  constructor(
    @Inject('COURSE_PORT') private readonly port: CoursePort,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
    @InjectPinoLogger(CourseApplication.name)
    private readonly logger: PinoLogger,
  ) {}

  async save(course: Course, idempotencyKey: string | null | undefined) {
    if (idempotencyKey) {
      this.logger.info(
        'Saving course with idempotency key: %s',
        idempotencyKey,
      );
      const cached = await this.cacheManager.get<string>(idempotencyKey);

      if (cached) {
        this.logger.info(
          'Found cached course with idempotency key: %s',
          idempotencyKey,
        );
        return JSON.parse(cached);
      }

      this.logger.info(
        'No cached course found with idempotency key: %s, saving new course',
        idempotencyKey,
      );

      await this.port.save(course);

      const result = JSON.stringify(course.properties);
      const ttl = this.configService.get<number>('redis.ttl_idempotency');
      await this.cacheManager.set(idempotencyKey, result, ttl);

      this.logger.info(
        'Course saved and cached with idempotency key: %s, ttl: %d seconds',
        idempotencyKey,
        ttl,
      );

      return result;
    }

    return await this.port.save(course);
  }

  async update(courseId: number, props: CoursePropsUpdate): Promise<void> {
    const course = await this.port.getById(courseId);

    if (!course) {
      throw new Error('Course not found');
    }

    course.update(props);
    return this.port.save(course);
  }

  async delete(courseId: number): Promise<void> {
    const course = await this.port.getById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    course.delete();
    return this.port.save(course);
  }

  getById(courseId: number): Promise<Course | null> {
    return this.port.getById(courseId);
  }

  getByPage(page: number, pageSize: number): Promise<ResultPage<Course>> {
    return this.port.getByPage(page, pageSize);
  }

  getByPageAndCursor(
    cursor: number | null,
    pageSize: number,
  ): Promise<ResultPage<Course>> {
    return this.port.getByPageAndCursor(cursor, pageSize);
  }

  getAll(): Promise<Course[]> {
    return this.port.getAll();
  }
}
