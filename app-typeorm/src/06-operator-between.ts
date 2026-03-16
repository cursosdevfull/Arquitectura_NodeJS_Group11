import { Between } from "typeorm";
import { appDataSource } from "./data-source";
import { UserEntity } from "./entities/06-operator-between/user.entity";

appDataSource
  .initialize()
  .then(async () => {
    const userRepository = appDataSource.getRepository(UserEntity);

    const user01 = new UserEntity();
    user01.name = "Alice Smith";
    user01.email = "alice.smith@email.com";
    user01.age = 30;
    user01.active = true;

    const user02 = new UserEntity();
    user02.name = "Bob Johnson";
    user02.email = "bob.johnson@email.com";
    user02.age = 25;

    const user03 = new UserEntity();
    user03.name = "Charlie Brown";
    user03.email = "charlie.brown@email.com";
    user03.age = 35;

    const user04 = new UserEntity();
    user04.name = "David Wilson";
    user04.email = "david.wilson@email.com";
    user04.age = 28;
    user04.active = false;

    await userRepository.save([user01, user02, user03, user04]);

    const usersBetweenAges = await userRepository.find({
      where: {
        age: Between(24, 29),
      },
    });

    console.log("Users between ages 26 and 29:", usersBetweenAges);
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
