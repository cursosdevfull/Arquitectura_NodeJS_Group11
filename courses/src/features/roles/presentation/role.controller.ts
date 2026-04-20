import { CircuitBreaker, CircuitBreakerRejectedError } from '@core/patterns';
import { ResultPage } from '@core/responses';
import { Role } from '@roles/domain';
import { type RoleUseCasePort } from '@roles/ports';
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
  RoleCreateDto,
  RoleHeadersDto,
  RoleIdDto,
  RolePageDto,
  RolePageV2Dto,
  RoleUpdateDto,
} from './dtos';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

const circuitBreaker = new CircuitBreaker(4, 1, 5000);
const retryAfter = 60;

@Controller('role')
export class RoleController {
  constructor(
    @Inject('ROLE_USE_CASE_PORT')
    private readonly application: RoleUseCasePort,
    @InjectPinoLogger(RoleController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Get()
  async getAll(@Res({ passthrough: true }) response: Response) {
    try {
      return await circuitBreaker.call(
        () => this.application.getAll() as Promise<Role[]>,
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
    @Query() query: RolePageDto,
  ) {
    console.log('Getting roles by page with params:');
    console.log('Received query:', query);
    try {
      return await circuitBreaker.call(
        () =>
          this.application.getByPage(query.page, query.pageSize) as Promise<
            ResultPage<Role>
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
    @Query() query: RolePageV2Dto,
  ) {
    try {
      return await circuitBreaker.call(
        () =>
          this.application.getByPageAndCursor(
            query.cursor,
            query.pageSize,
          ) as Promise<ResultPage<Role>>,
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

  @Get(':roleId')
  async getById(
    @Res({ passthrough: true }) response: Response,
    @Param() param: RoleIdDto,
  ) {
    try {
      return await circuitBreaker.call(
        () => this.application.getById(param.roleId) as Promise<Role | null>,
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
    @Body() role: RoleCreateDto,
    @Headers() headers: RoleHeadersDto,
  ) {
    try {
      this.logger.info('Creating role with name: %s', role.name);
      const domain = new Role({ name: role.name });
      await circuitBreaker.call(() =>
        this.application.save(domain, headers['x-idempotency']),
      );
      response.status(HttpStatus.CREATED);
    } catch (error: unknown) {
      this.logger.error(
        'Error creating role: %s',
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

  @Put(':roleId')
  async update(
    @Res({ passthrough: true }) response: Response,
    @Param() param: RoleIdDto,
    @Body() role: RoleUpdateDto,
  ) {
    try {
      await circuitBreaker.call(
        () => this.application.update(param.roleId, role) as Promise<void>,
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

  @Delete(':roleId')
  async delete(
    @Res({ passthrough: true }) response: Response,
    @Param() param: RoleIdDto,
  ) {
    try {
      await circuitBreaker.call(
        () => this.application.delete(param.roleId) as Promise<void>,
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
