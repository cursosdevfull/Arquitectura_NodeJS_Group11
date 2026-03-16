import { appDataSource } from "./data-source";
import { UserEntity } from "./entities/04-find-where/user.entity";

appDataSource
  .initialize()
  .then(async () => {
    const userRepository = appDataSource.getRepository(UserEntity);

    const usersNamedBob = await userRepository.find({
      where: { name: "Bob Johnson" },
    });

    const usersWithEmail = await userRepository.findOne({
      where: { email: "charlie.brown@email.com" },
    });

    console.log("Users named Bob Johnson:", usersNamedBob);
    console.log("User with email charlie.brown@email.com:", usersWithEmail);
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
