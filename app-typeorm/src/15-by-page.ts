import { Between } from "typeorm";
import { appDataSource } from "./data-source";
import { UserEntity } from "./entities/15-by-page/user.entity";

appDataSource
  .initialize()
  .then(async () => {
    const userRepository = appDataSource.getRepository(UserEntity);

    const pageSize = 3;
    const currentPage = 3;

    /*     const users = await userRepository.find({
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }); */

    const [users, total] = await userRepository.findAndCount({
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    });

    console.log("Users found:", JSON.stringify(users, null, "\t"));
    console.log("Total users:", total);
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
