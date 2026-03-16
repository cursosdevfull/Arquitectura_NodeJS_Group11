import { Between, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { appDataSource } from "./data-source";
import { UserEntity } from "./entities/17-query-builder/user.entity";

appDataSource
  .initialize()
  .then(async () => {
    const userRepository = appDataSource.getRepository(UserEntity);

    const results = await userRepository
      .createQueryBuilder("usuario")
      .where("usuario.age >= :minAge", { minAge: 20 })
      //.getMany();
      .getRawMany();

    console.log("Users found:", JSON.stringify(results, null, "\t"));
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
