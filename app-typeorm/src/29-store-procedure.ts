import { appDataSource } from "./data-source";

appDataSource
  .initialize()
  .then(async () => {
    const manager = appDataSource.manager;

    const results = await manager.query("call studentsByAge(?)", [30]);

    console.log("Users:", results[0]);
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
