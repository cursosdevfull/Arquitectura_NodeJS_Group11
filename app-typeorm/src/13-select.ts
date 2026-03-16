import { Between } from "typeorm";
import { appDataSource } from "./data-source";
import { UserEntity } from "./entities/13-select/user.entity";

appDataSource
  .initialize()
  .then(async () => {
    const userRepository = appDataSource.getRepository(UserEntity);

    const users = await userRepository.find({
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        roles: { name: true, area: { name: true } },
      },
      relations: ["roles.area"],
      where: { age: Between(30, 40) },
    });

    console.log("Users found:", JSON.stringify(users, null, "\t"));
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
