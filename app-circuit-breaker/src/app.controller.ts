import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { AppService } from './app.service';
import {
  CircuitBreaker,
  CircuitBreakerRejectedError,
} from './circuit-breaker/circuit-breaker';

const circuitBreaker = new CircuitBreaker(4, 1, 5000);
const retryAfter = 60;

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async executeRequest(
    @Body() payload: Record<string, unknown>,
    @Res({ passthrough: true }) response: Response,
  ): Promise<string> {
    try {
      return await circuitBreaker.call(
        () => this.appService.executeTask(payload) as Promise<string>,
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
}
