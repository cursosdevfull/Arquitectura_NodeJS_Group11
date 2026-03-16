import { appDataSource } from "./data-source";
import { UserEntity } from "./entities/24-distinct/user.entity";

appDataSource
  .initialize()
  .then(async () => {
    const manager = appDataSource.manager;

    const results = await manager
      .createQueryBuilder()
      .select("distinct usuario.name", "distinctNames")
      .from(UserEntity, "usuario")
      .getRawMany();

    console.log("Result:", results);
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
