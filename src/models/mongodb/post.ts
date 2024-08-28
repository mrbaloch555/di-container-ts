import { Model } from "../../database/base";
import { MongoClient, Collection, ObjectId } from "mongodb";

// Define the Post interface
export interface Post {
  id?: string;
  user: number;
  text: string;
  comments?: {
    user: number;
    text: string;
    createdAt: Date;
  }[];
  createdAt: Date;
}

// Define the PostModel class that implements CRUD operations
export class PostModel implements Model<Post> {
  private collection: Collection<Post>;

  constructor(private client: MongoClient) {
    // Connect to the 'posts' collection in the MongoDB database
    this.collection = this.client.db().collection<Post>("posts");
  }

  // Implement the create method
  async create(body: Post): Promise<boolean> {
    try {
      const result = await this.collection.insertOne(body);
      console.log("Post inserted successfully.");
      return result.insertedId ? true : false;
    } catch (error) {
      throw error;
    }
  }

  // Implement the findAll method
  async findAll(params: any = {}): Promise<Post[]> {
    try {
      const posts = await this.collection.find(params).toArray();
      console.log("Posts fetched successfully.");
      return posts;
    } catch (error) {
      throw error;
    }
  }

  // Implement the findOne method
  async findOne(params: any): Promise<Post | null> {
    try {
      const { id } = params;
      const post = await this.collection.findOne({ _id: new ObjectId(id) });
      console.log("Post fetched successfully.");
      return post;
    } catch (error) {
      throw error;
    }
  }

  // Implement the updateOne method
  async updateOne(id: string | number, body: Post): Promise<Post | null> {
    try {
      const result = await this.collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            user: body.user,
            text: body.text,
            comments: body.comments,
            createdAt: body.createdAt,
          },
        },
        { returnDocument: "after" }
      );
      console.log("Post updated successfully.");
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Implement the deleteOne method
  async deleteOne(id: string | number): Promise<boolean> {
    try {
      const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return false; // No documents were deleted
      }
      console.log("Post deleted successfully.");
      return true;
    } catch (error) {
      throw error;
    }
  }
}
