import { appDataSource } from "./data-source";
import { UserEntity } from "./entities/19-manager-where/user.entity";

appDataSource
  .initialize()
  .then(async () => {
    const manager = appDataSource.manager;

    const results = await manager
      .createQueryBuilder(UserEntity, "usuarios")
      .select(["usuarios.id", "usuarios.name", "usuarios.email"])
      .where("usuarios.id >= :minId")
      .andWhere("usuarios.age >= :minAge")
      //.setParameters({ minId: 7, minAge: 30 })
      .setParameter("minId", 7)
      .setParameter("minAge", 30)
      .getMany();

    console.log("Users found:", JSON.stringify(results, null, "\t"));
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
