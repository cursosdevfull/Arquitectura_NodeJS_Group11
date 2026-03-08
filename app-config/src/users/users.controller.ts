import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Env } from "src/configuration/config";
import { EnvYaml } from "src/configuration/config-yml";

@Controller('users')
export class UsersController {
    constructor(private readonly configService: ConfigService) {}

    @Get()
    getInfoEnvironment() {
        //return this.configService.get<string>('DB_HOST') as string;
        //return this.configService.get<Env["DB_USER"]>('DB_USER') as string;
        //return this.configService.get<EnvYaml["DATABASE"]["PASSWORD"]>('DATABASE.PASSWORD') as string;
        return this.configService.get<number>('PORT') as number;
    }
}