export interface Model<T> {
  create(body: T): Promise<boolean>;
  findAll(params: any): Promise<T[]>;
  findOne(params: any): Promise<T | null>;
  updateOne(id: string | number, body: T): Promise<T | null>;
  deleteOne(id: string | number): Promise<boolean>;
}
