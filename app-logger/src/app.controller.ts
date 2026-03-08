import { Controller, Get } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    @InjectPinoLogger(AppController.name)
    private readonly logger: PinoLogger,
    private readonly appService: AppService,
  ) {}

  @Get()
  getUsers() {
    this.logger.info('Handling getUsers request');
    return this.appService.getUsers();
  }
}
