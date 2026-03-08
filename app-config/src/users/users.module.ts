import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { ConfigModule } from "@nestjs/config";

@Module({
   /*  imports: [ConfigModule.forRoot({
        envFilePath: [ '.development.local.env', '.development.env'],
    })], */
    controllers: [UsersController],
})
export class UsersModule {}