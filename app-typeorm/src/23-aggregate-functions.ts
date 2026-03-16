import { appDataSource } from "./data-source";
import { AreaEntity } from "./entities/22-update/area.entity";
import { UserEntity } from "./entities/23-aggregate-functions/user.entity";

appDataSource
  .initialize()
  .then(async () => {
    const manager = appDataSource.manager;

    const results = await manager
      .createQueryBuilder()
      .select("sum(usuario.age)", "totalAge")
      .addSelect("count(*)", "totalUsers")
      .addSelect("avg(usuario.age)", "averageAge")
      .from(UserEntity, "usuario")
      .getRawOne();

    console.log("Result:", results);
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
