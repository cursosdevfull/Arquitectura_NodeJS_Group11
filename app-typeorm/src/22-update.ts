import { appDataSource } from "./data-source";
import { AreaEntity } from "./entities/22-update/area.entity";

appDataSource
  .initialize()
  .then(async () => {
    const manager = appDataSource.manager;

    const results = await manager
      .createQueryBuilder()
      .update(AreaEntity)
      .set({ name: "Platform Support" })
      .where("id = :id", { id: 2 })
      .orWhere("name = :name", { name: "Data Engineer" })
      .execute();

    console.log("Update Result:", results);
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
