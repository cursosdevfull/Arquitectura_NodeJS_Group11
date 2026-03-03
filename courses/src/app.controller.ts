import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("database")
  getDatabaseInfo() {
    console.log('Getting database information from AppController...');
    return this.appService.getInfoDatabase();
  }
}
