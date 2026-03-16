import { appDataSource } from "./data-source";
import { UserEntity } from "./entities/11-relations/user.entity";

appDataSource
  .initialize()
  .then(async () => {
    const userRepository = appDataSource.getRepository(UserEntity);

    const users = await userRepository.find({
      relations: ["roles", "roles.area"],
    });

    console.log("Users found:", JSON.stringify(users, null, "\t"));
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
