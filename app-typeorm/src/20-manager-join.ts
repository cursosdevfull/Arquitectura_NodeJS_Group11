import { appDataSource } from "./data-source";
import { AreaEntity } from "./entities/20-manager-join/area.entity";

appDataSource
  .initialize()
  .then(async () => {
    const manager = appDataSource.manager;

    const results = await manager
      .createQueryBuilder(AreaEntity, "area")
      //.innerJoin("area.roles", "role")
      .leftJoin("area.roles", "role")
      .select(["area.name", "role.name"])
      .getMany();

    console.log("Users found:", JSON.stringify(results, null, "\t"));
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
