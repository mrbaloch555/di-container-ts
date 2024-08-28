import { MongoClient } from "mongodb";

export const connectMongoDB = (): MongoClient => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI!);
    return client;
  } catch (error) {
    throw error;
  }
};
