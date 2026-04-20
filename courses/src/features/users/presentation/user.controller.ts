import { CircuitBreaker, CircuitBreakerRejectedError } from '@core/patterns';
import { ResultPage } from '@core/responses';
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
import { User } from '@users/domain';
import { type UserUseCasePort } from '@users/ports';
import type { Response } from 'express';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import {
  UserCreateDto,
  UserHeadersDto,
  UserIdDto,
  UserPageDto,
  UserPageV2Dto,
  UserUpdateDto,
} from './dtos';

const circuitBreaker = new CircuitBreaker(4, 1, 5000);
const retryAfter = 60;

@Controller('user')
export class UserController {
  constructor(
    @Inject('USER_USE_CASE_PORT')
    private readonly application: UserUseCasePort,
    @InjectPinoLogger(UserController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Get()
  async getAll(@Res({ passthrough: true }) response: Response) {
    try {
      return await circuitBreaker.call(
        () => this.application.getAll() as Promise<User[]>,
      );
    } catch (error: unknown) {
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

      throw new HttpException(
        error instanceof Error ? error.message : String(error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('page')
  async getByPage(
    @Res({ passthrough: true }) response: Response,
    @Query() query: UserPageDto,
  ) {
    try {
      return await circuitBreaker.call(
        () =>
          this.application.getByPage(query.page, query.pageSize) as Promise<
            ResultPage<User>
          >,
      );
    } catch (error: unknown) {
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

      throw new HttpException(
        error instanceof Error ? error.message : String(error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('page')
  @Version('2')
  async getByPageAndCursor(
    @Res({ passthrough: true }) response: Response,
    @Query() query: UserPageV2Dto,
  ) {
    try {
      return await circuitBreaker.call(
        () =>
          this.application.getByPageAndCursor(
            query.cursor,
            query.pageSize,
          ) as Promise<ResultPage<User>>,
      );
    } catch (error: unknown) {
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

      throw new HttpException(
        error instanceof Error ? error.message : String(error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':userId')
  async getById(
    @Res({ passthrough: true }) response: Response,
    @Param() param: UserIdDto,
  ) {
    try {
      return await circuitBreaker.call(
        () => this.application.getById(param.userId) as Promise<User | null>,
      );
    } catch (error: unknown) {
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

      throw new HttpException(
        error instanceof Error ? error.message : String(error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(
    @Res({ passthrough: true }) response: Response,
    @Body() user: UserCreateDto,
    @Headers() headers: UserHeadersDto,
  ) {
    try {
      this.logger.info('Creating user with name: %s', user.name);
      const domain = new User({
        name: user.name,
        email: user.email,
        roleId: user.roleId,
      });
      await circuitBreaker.call(() =>
        this.application.save(domain, headers['x-idempotency']),
      );
      response.status(HttpStatus.CREATED);
    } catch (error: unknown) {
      this.logger.error(
        'Error creating user: %s',
        error instanceof Error ? error.message : String(error),
      );
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

      throw new HttpException(
        error instanceof Error ? error.message : String(error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':userId')
  async update(
    @Res({ passthrough: true }) response: Response,
    @Param() param: UserIdDto,
    @Body() user: UserUpdateDto,
  ) {
    try {
      await circuitBreaker.call(
        () => this.application.update(param.userId, user) as Promise<void>,
      );
      response.status(HttpStatus.CREATED);
    } catch (error: unknown) {
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

      throw new HttpException(
        error instanceof Error ? error.message : String(error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':userId')
  async delete(
    @Res({ passthrough: true }) response: Response,
    @Param() param: UserIdDto,
  ) {
    try {
      await circuitBreaker.call(
        () => this.application.delete(param.userId) as Promise<void>,
      );
      response.status(HttpStatus.NO_CONTENT);
    } catch (error: unknown) {
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

      throw new HttpException(
        error instanceof Error ? error.message : String(error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
