import { UserController } from "../controller/user";
import { connectPG } from "../database/postgres";
import { UserModel } from "../models/pg/user";
import { UserService } from "../services/user";
import { DIContainer } from "./container";
import { Client } from "pg";

export async function initializeDependencies() {
  const client = await connectPG();

  DIContainer.register<Client>("Client", client);

  const userRepo = new UserModel(client);
  DIContainer.register<UserModel>("UserRepo", userRepo);

  const userService = new UserService(userRepo);
  DIContainer.register<UserService>("UserService", userService);

  const userController = new UserController(userService);
  DIContainer.register<UserController>("UserController", userController);
}
