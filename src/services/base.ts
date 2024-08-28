export interface Service<T> {
  create(body: T): Promise<boolean>;
  find(params: any): Promise<T[]>;
  findOne(params: any): Promise<T | null>;
  updateOne(id: number | string, body: T): Promise<T | null>;
  deleteOne(id: number | string): Promise<boolean>;
}

export type LoginPayload<T> = {
  user: T;
  token: {
    access: string;
    refresh: string;
  };
};

export interface IUserService<T> extends Service<T> {
  login(email: string, password: string): Promise<LoginPayload<T>>;
  register(body: T): Promise<boolean>;
}
