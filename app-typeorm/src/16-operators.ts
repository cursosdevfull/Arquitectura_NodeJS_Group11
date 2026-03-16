import { Between, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { appDataSource } from "./data-source";
import { UserEntity } from "./entities/16-operators/user.entity";

appDataSource
  .initialize()
  .then(async () => {
    const userRepository = appDataSource.getRepository(UserEntity);

    /*     const users = await userRepository.find({
      where: { age: MoreThanOrEqual(20) },
    }); */

    const users = await userRepository.find({
      where: { age: LessThanOrEqual(20) },
    });

    console.log("Users found:", JSON.stringify(users, null, "\t"));
  })

  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
