import { appDataSource } from "./data-source";
import { ProductEntity } from "./entities/01-data-mapper-active-record/product.entity";
import { UserEntity } from "./entities/01-data-mapper-active-record/user.entity";

appDataSource
  .initialize()
  .then(async () => {
    const userRepository = appDataSource.getRepository(UserEntity);

    // Create a new user
    const newUser = new UserEntity();
    newUser.name = "John Doe";
    newUser.email = "john.doe@email.com";

    await userRepository.save(newUser);

    const newProduct = new ProductEntity();
    newProduct.name = "Example Product";
    newProduct.price = 19.99;

    await newProduct.save();

    console.log("New user and product have been saved to the database.");
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
