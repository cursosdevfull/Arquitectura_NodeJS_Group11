import { appDataSource } from "./data-source";
import { RoleEntity } from "./entities/09-relation-many-to-many/role.entity";
import { UserEntity } from "./entities/09-relation-many-to-many/user.entity";

appDataSource
  .initialize()
  .then(async () => {
    const userRepository = appDataSource.getRepository(UserEntity);

    const role01 = new RoleEntity();
    role01.name = "Senior Developer";

    const role02 = new RoleEntity();
    role02.name = "Project Manager";

    const role03 = new RoleEntity();
    role03.name = "QA Engineer";

    const user01 = new UserEntity();
    user01.name = "Ada Lovelace";
    user01.email = "ada.lovelace@email.com";
    user01.age = 28;
    user01.active = true;
    user01.roles = [role01, role02];

    const user02 = new UserEntity();
    user02.name = "Alan Turing";
    user02.email = "alan.turing@email.com";
    user02.age = 35;
    user02.active = true;
    user02.roles = [role01, role03];

    const usersSaved = await userRepository.save([user01, user02]);
    console.log("Users saved:", usersSaved);
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
