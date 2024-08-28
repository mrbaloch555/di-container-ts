import { User, UserModel } from "../models/pg/user";
import { IUserService, LoginPayload } from "./base";

export class UserService implements IUserService<User> {
  constructor(private repo: UserModel) {}

  login(email: string, password: string): Promise<LoginPayload<User>> {
    throw new Error("Method not implemented.");
  }
  register(body: User): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async create(body: User): Promise<boolean> {
    const response = await this.repo.create(body);
    return response;
  }

  async find(params: any): Promise<User[]> {
    const users = await this.repo.findAll();
    return users;
  }

  async findOne(params: any): Promise<User | null> {
    const user = await this.repo.findOne(params);
    return user;
  }

  async updateOne(id: number | string, body: User): Promise<User | null> {
    const user = await this.repo.updateOne(id, body);
    return user;
  }

  async deleteOne(id: number | string): Promise<boolean> {
    const response = await this.repo.deleteOne(id);
    return response;
  }
}
