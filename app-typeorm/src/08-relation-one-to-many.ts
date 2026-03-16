import { appDataSource } from "./data-source";
import { RoleEntity } from "./entities/08-relation-one-to-many/role.entity";
import { UserEntity } from "./entities/08-relation-one-to-many/user.entity";

appDataSource
  .initialize()
  .then(async () => {
    const userRepository = appDataSource.getRepository(UserEntity);

    const role = new RoleEntity();
    role.name = "Senior Developer";

    const user = new UserEntity();
    user.name = "Ada Lovelace";
    user.email = "ada.lovelace@email.com";
    user.age = 28;
    user.active = true;
    user.role = role;

    const userSaved = await userRepository.save(user);
    console.log("User saved:", userSaved);

    const newUser = new UserEntity();
    newUser.name = "Grace Hopper";
    newUser.email = "grace.hopper@email.com";
    newUser.age = 35;
    newUser.role = role;

    const newUserSaved = await userRepository.save(newUser);
    console.log("New user saved:", newUserSaved);
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
