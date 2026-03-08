import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { config } from './configuration/config';
import { configYml } from './configuration/config-yml';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    //envFilePath: [ '.development.local.env', '.development.env'],
    ignoreEnvFile: true, //process.env.NODE_ENV === 'production',
    /*load: [() =>({
        dbHost: process.env.DB_HOST,
        dbPort: process.env.DB_PORT,
        dbUser: process.env.DB_USER,
      })]*/
     //load: [config]
     load: [configYml]
  }),
  UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
