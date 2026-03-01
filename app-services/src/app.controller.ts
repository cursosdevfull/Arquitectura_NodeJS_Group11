import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { type IConfiguration } from './app.interface';

@Controller()
export class AppController {
  constructor(
    @Inject("ServiceUsers") private readonly service: AppService, 
    @Inject("Configuration") private readonly config: IConfiguration, 
    @Inject("ConnectionDatabase") private readonly db: any, 
    @Inject("ConnectionDatabase") private readonly dbInfo: any, 
    @Inject(AppService) private readonly appService: AppService) {}

  @Get()
  getUsers(): string[] {
    return this.service.getUsers();
  }

  @Get('config')
  getConfig(): IConfiguration {
    return this.config;
  }

  @Get('db')
  getDbUsers(): string[] {
    return this.db.findUsers();
  }

  @Get('db-info')
  getDbInfo(): string {
    return this.dbInfo.info;
  }

  @Get('app-service')
  getAppServiceUsers(): string[] {
    return this.appService.getUsers();
  }
}
