import { appDataSource } from "./data-source";
import { OrderEntity } from "./entities/26-order/order.entity";

appDataSource
  .initialize()
  .then(async () => {
    const manager = appDataSource.manager;

    const results = await manager
      .createQueryBuilder()
      .from(OrderEntity, "order")
      .select(
        "customerId, product, sum(order.price * order.quantity) as totalSpent",
      )
      .orderBy("product", "DESC")
      .addOrderBy("totalSpent", "DESC")
      .addOrderBy("customerId", "ASC")
      .groupBy("customerId, product")
      .getRawMany();

    console.log("Total spent by each customer:", results);
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
