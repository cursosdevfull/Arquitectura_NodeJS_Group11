import { appDataSource } from "./data-source";
import { UserEntity } from "./entities/04-find-where/user.entity";

appDataSource
  .initialize()
  .then(async () => {
    const userRepository = appDataSource.getRepository(UserEntity);

    const userNamedBob = await userRepository.findOne({
      where: { name: "Bob Johnson" },
    });

    const userWithEmail = await userRepository.findOne({
      where: { email: "charlie.brown@email.com" },
    });

    console.log("User named Bob Johnson:", userNamedBob);
    console.log("User with email charlie.brown@email.com:", userWithEmail);

    userNamedBob.active = false;
    userWithEmail.name = "Charlie Brown Jr.";

    await userRepository.save(userNamedBob);
    await userRepository.save(userWithEmail);

    console.log("Updated user named Bob Johnson:", userNamedBob);
    console.log("Updated user with email:", userWithEmail);
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
