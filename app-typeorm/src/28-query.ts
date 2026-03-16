import { appDataSource } from "./data-source";
import { UserEntity } from "./entities/27-limit-offset/user.entity";

appDataSource
  .initialize()
  .then(async () => {
    const manager = appDataSource.manager;

    const results = await manager.query(
      "select * from users where age < ?",
      [30],
    );

    console.log("Users:", results);
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
