import { UserService } from "../services/user";

export class UserController {
  constructor(private service: UserService) {}

  async create(req: any, res: any) {
    const { body } = req;
    const response = await this.service.create(body);

    res.send(response);
  }

  async find(req: any, res: any) {
    const users = await this.service.find({});
    res.send(users);
  }

  async findOne(req: any, res: any) {
    const { id } = req.params;
    const user = await this.service.findOne(id);
    res.send(user);
  }

  async updateOne(req: any, res: any) {
    const { id } = req.params;
    const { body } = req;

    const user = await this.service.updateOne(id, body);
    res.send(user);
  }

  async deleteOne(req: any, res: any) {
    const { id } = req.params;
    const response = await this.service.deleteOne(id);
    res.status(200).send(response);
  }
}
