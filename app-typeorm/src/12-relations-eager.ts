import { appDataSource } from "./data-source";
import { UserEntity } from "./entities/12-relations-eager/user.entity";

appDataSource
  .initialize()
  .then(async () => {
    const userRepository = appDataSource.getRepository(UserEntity);

    const users = await userRepository.find();

    console.log("Users found:", JSON.stringify(users, null, "\t"));
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
