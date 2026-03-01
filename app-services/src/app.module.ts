import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { IConfiguration } from './app.interface';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    {
      provide: "ServiceUsers",
      useClass: AppService
    },
    {
      provide: "Configuration",
      useValue: {
        host: "localhost",
        port: 5432,
        username: "admin",
        password: "admin",
        database: "mydb"
      }
    },
    {
      provide: "ConnectionDatabase",
      useFactory: (config: IConfiguration) => {
        return {
          info: `Connected to database ${config.database} at ${config.host}:${config.port} with user ${config.username}`,
          findUsers: () => {
            return ["user01", "user02", "user03", "user04", "user05"]
          }
        }
      },
      inject: ["Configuration"]
    },
    {
      provide: AppService,
      useClass: AppService
    },
    AppService
  ],
})
export class AppModule {}
