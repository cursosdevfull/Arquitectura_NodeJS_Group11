import { appDataSource } from "./data-source";
import { AreaEntity } from "./entities/21-manager-join-advanced/area.entity";

appDataSource
  .initialize()
  .then(async () => {
    const manager = appDataSource.manager;

    const results = await manager
      .createQueryBuilder()
      .from(AreaEntity, "area")
      .select(["area.name", "role.name", "user.name", "user.email"])
      .innerJoin("area.roles", "role")
      .innerJoin("role.users", "user")
      .getMany();

    console.log("Users found:", JSON.stringify(results, null, "\t"));
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
