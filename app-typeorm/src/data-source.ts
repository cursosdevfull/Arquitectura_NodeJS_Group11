import { DataSource } from "typeorm";
import { UserEntity } from "./entities/29-store-procedure/user.entity";

export const appDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "user",
  password: "3lGigante2026?",
  database: "example",
  entities: [UserEntity],
  synchronize: true,
});
