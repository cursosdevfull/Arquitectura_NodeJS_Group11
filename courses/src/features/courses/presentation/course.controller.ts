import { CircuitBreaker, CircuitBreakerRejectedError } from '@core/patterns';
import { ResultPage } from '@core/responses';
import { Course } from '@courses/domain';
import { type CourseUseCasePort } from '@courses/ports';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Res,
  Version,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  CourseCreateDto,
  CourseHeadersDto,
  CourseIdDto,
  CoursePageDto,
  CoursePageV2Dto,
  CourseUpdateDto,
} from './dtos';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

const circuitBreaker = new CircuitBreaker(4, 1, 5000);
const retryAfter = 60;

@Controller('course')
export class CourseController {
  constructor(
    @Inject('COURSE_USE_CASE_PORT')
    private readonly application: CourseUseCasePort,
    @InjectPinoLogger(CourseController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Get()
  async getAll(@Res({ passthrough: true }) response: Response) {
    try {
      return await circuitBreaker.call(
        () => this.application.getAll() as Promise<Course[]>,
      );
    } catch (error) {
      if (error instanceof CircuitBreakerRejectedError) {
        response.setHeader('Retry-After', retryAfter.toString());

        throw new HttpException(
          {
            message: 'Service unavailable',
            retryAfter,
          },
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('page')
  async getByPage(
    @Res({ passthrough: true }) response: Response,
    @Query() query: CoursePageDto,
  ) {
    console.log('Getting courses by page with params:');
    console.log('Received query:', query);
    try {
      return await circuitBreaker.call(
        () =>
          this.application.getByPage(query.page, query.pageSize) as Promise<
            ResultPage<Course>
          >,
      );
    } catch (error) {
      if (error instanceof CircuitBreakerRejectedError) {
        response.setHeader('Retry-After', retryAfter.toString());

        throw new HttpException(
          {
            message: 'Service unavailable',
            retryAfter,
          },
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('page')
  @Version('2')
  async getByPageAndCursor(
    @Res({ passthrough: true }) response: Response,
    @Query() query: CoursePageV2Dto,
  ) {
    try {
      return await circuitBreaker.call(
        () =>
          this.application.getByPageAndCursor(
            query.cursor,
            query.pageSize,
          ) as Promise<ResultPage<Course>>,
      );
    } catch (error) {
      if (error instanceof CircuitBreakerRejectedError) {
        response.setHeader('Retry-After', retryAfter.toString());

        throw new HttpException(
          {
            message: 'Service unavailable',
            retryAfter,
          },
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':courseId')
  async getById(
    @Res({ passthrough: true }) response: Response,
    @Param() param: CourseIdDto,
  ) {
    try {
      return await circuitBreaker.call(
        () =>
          this.application.getById(param.courseId) as Promise<Course | null>,
      );
    } catch (error) {
      if (error instanceof CircuitBreakerRejectedError) {
        response.setHeader('Retry-After', retryAfter.toString());

        throw new HttpException(
          {
            message: 'Service unavailable',
            retryAfter,
          },
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async create(
    @Res({ passthrough: true }) response: Response,
    @Body() course: CourseCreateDto,
    @Headers() headers: CourseHeadersDto,
  ) {
    try {
      this.logger.info('Creating course with name: %s', course.name);
      const domain = new Course({ name: course.name });
      await circuitBreaker.call(() =>
        this.application.save(domain, headers['x-idempotency']),
      );
      response.status(HttpStatus.CREATED);
    } catch (error) {
      this.logger.error('Error creating course: %s', error instanceof Error ? error.message : String(error));
      if (error instanceof CircuitBreakerRejectedError) {
        response.setHeader('Retry-After', retryAfter.toString());

        throw new HttpException(
          {
            message: 'Service unavailable',
            retryAfter,
          },
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':courseId')
  async update(
    @Res({ passthrough: true }) response: Response,
    @Param() param: CourseIdDto,
    @Body() course: CourseUpdateDto,
  ) {
    try {
      await circuitBreaker.call(
        () => this.application.update(param.courseId, course) as Promise<void>,
      );
      response.status(HttpStatus.CREATED);
    } catch (error) {
      if (error instanceof CircuitBreakerRejectedError) {
        response.setHeader('Retry-After', retryAfter.toString());

        throw new HttpException(
          {
            message: 'Service unavailable',
            retryAfter,
          },
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':courseId')
  async delete(
    @Res({ passthrough: true }) response: Response,
    @Param() param: CourseIdDto,
  ) {
    try {
      await circuitBreaker.call(
        () => this.application.delete(param.courseId) as Promise<void>,
      );
      response.status(HttpStatus.NO_CONTENT);
    } catch (error) {
      if (error instanceof CircuitBreakerRejectedError) {
        response.setHeader('Retry-After', retryAfter.toString());

        throw new HttpException(
          {
            message: 'Service unavailable',
            retryAfter,
          },
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
