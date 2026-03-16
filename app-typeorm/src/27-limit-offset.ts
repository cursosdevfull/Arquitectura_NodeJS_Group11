import { appDataSource } from "./data-source";
import { OrderEntity } from "./entities/26-order/order.entity";
import { UserEntity } from "./entities/27-limit-offset/user.entity";

appDataSource
  .initialize()
  .then(async () => {
    const manager = appDataSource.manager;

    const results = await manager
      .createQueryBuilder()
      .from(UserEntity, "user")
      .orderBy("user.age", "DESC")
      .limit(3)
      .offset(3)
      .getRawMany();

    console.log("Users:", results);
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
