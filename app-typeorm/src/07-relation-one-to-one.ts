import { appDataSource } from "./data-source";
import { RoleEntity } from "./entities/07-relation-one-to-one/role.entity";
import { UserEntity } from "./entities/07-relation-one-to-one/user.entity";

appDataSource
  .initialize()
  .then(async () => {
    const userRepository = appDataSource.getRepository(UserEntity);
    const roleRepository = appDataSource.getRepository(RoleEntity);

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

    /*     const role = roleRepository.create({ name: "Admin" });
    const roleSaved = await roleRepository.save(role);

    const user = new UserEntity();
    user.name = "John Doe";
    user.email = "john.doe@email.com";
    user.age = 30;
    user.active = true;
    user.role = roleSaved;

    const userSaved = await userRepository.save(user);
    console.log("User saved:", userSaved); */
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
