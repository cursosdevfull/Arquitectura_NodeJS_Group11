import { Between, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { appDataSource } from "./data-source";
import { UserEntity } from "./entities/18-manager/user.entity";

appDataSource
  .initialize()
  .then(async () => {
    const manager = appDataSource.manager;

    const results = await manager
      .createQueryBuilder(UserEntity, "usuarios")
      .select(["usuarios.id", "usuarios.name", "usuarios.email"])
      .where("usuarios.id >= :minId and usuarios.age >= :minAge", {
        minId: 7,
        minAge: 35,
      })
      .getRawMany();

    console.log("Users found:", JSON.stringify(results, null, "\t"));
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
