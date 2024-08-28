import dotenv from "dotenv";
import { UserController } from "./controller/user";
import { initializeDependencies } from "./DepdencyContainer/initialzer";
import { DIContainer } from "./DepdencyContainer/container";

dotenv.config();

async function run() {
  await initializeDependencies();

  const userController = DIContainer.resolve<UserController>("UserController");
  //   const client = await connectPG();
  //   const userRepo = new UserModel(client);
  //   const userService = new UserService(userRepo);
  //   const userController = new UserController(userService);

  const req = {
    body: {
      email: "abc114@gmail.com",
      password: "abcsdsd",
      name: "Durrah Khan",
    },
  };
  const res = {
    status: (statusCode: number) => {
      //   this.statusCode = statusCode;
    },
    send(response: any) {
      console.log(response);
      return response;
    },
  };

  const isUserCreated = await userController.create(req, res);
  const userList = await userController.find(req, res);
  console.log(userList);
}

run();
