import { appDataSource } from "./data-source";
import { ProductEntity } from "./entities/01-data-mapper-active-record/product.entity";
import { UserEntity } from "./entities/01-data-mapper-active-record/user.entity";

appDataSource
  .initialize()
  .then(async () => {
    const userRepository = appDataSource.getRepository(UserEntity);

    const users = await userRepository.find();
    console.log("All users:", users);
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
