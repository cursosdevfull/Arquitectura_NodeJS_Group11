import { appDataSource } from "./data-source";
import { RoleEntity } from "./entities/10-non-entity/role.entity";
import { UserEntity } from "./entities/10-non-entity/user.entity";

appDataSource
  .initialize()
  .then(async () => {
    const userRepository = appDataSource.getRepository(UserEntity);

    const roles01 = [
      {id: 1}, {id: 2}
    ]
    
    const user01 = new UserEntity();
    user01.name = "Ada Lovelace";
    user01.email = "ada.lovelace@email.com";
    user01.age = 28;
    user01.active = true;
    user01.roles = roles01 as RoleEntity[];

    const roles02 = [
      {id: 1}, {id: 3}
    ]

    const user02 = new UserEntity();
    user02.name = "Alan Turing";
    user02.email = "alan.turing@email.com";
    user02.age = 35;
    user02.active = true;
    user02.roles = roles02 as RoleEntity[];

    const usersSaved = await userRepository.save([user01, user02]);
    console.log("Users saved:", usersSaved);
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
