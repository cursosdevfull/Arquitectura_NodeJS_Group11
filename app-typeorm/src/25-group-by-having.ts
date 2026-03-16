import { appDataSource } from "./data-source";
import { OrderEntity } from "./entities/25-group-by-having/order.entity";

appDataSource
  .initialize()
  .then(async () => {
    const manager = appDataSource.manager;

    const results = await manager
      .createQueryBuilder()
      .from(OrderEntity, "order")
      .select("customerId, sum(order.price * order.quantity) as totalSpent")
      .groupBy("customerId")
      .having("totalSpent > :minTotal", { minTotal: 3000 })
      .getRawMany();

    console.log("Total spent by each customer:", results);
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
