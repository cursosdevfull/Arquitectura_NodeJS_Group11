import { appDataSource } from "./data-source";
import { UserEntity } from "./entities/03-multiple-user/user.entity";

appDataSource
  .initialize()
  .then(async () => {
    const userRepository = appDataSource.getRepository(UserEntity);

    const user01 = new UserEntity();
    user01.name = "Alice Smith";
    user01.email = "alice.smith@email.com";

    const user02 = new UserEntity();
    user02.name = "Bob Johnson";
    user02.email = "bob.johnson@email.com";

    const user03 = new UserEntity();
    user03.name = "Charlie Brown";
    user03.email = "charlie.brown@email.com";

    await userRepository.save([user01, user02, user03]);

    console.log("Multiple users have been saved to the database.");
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
