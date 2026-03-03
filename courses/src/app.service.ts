import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getInfoDatabase() {
    const dbHost = this.configService.get<string>('DATABASE_HOST');
    const dbPort = this.configService.get<number>('DATABASE_PORT');
    const dbUser = this.configService.get<string>('DATABASE_USER');
    const dbPass = this.configService.get<string>('DATABASE_PASS');
    const dbName = this.configService.get<string>('DATABASE_NAME');

    return {
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPass,
      name: dbName,
    };
  }
}
