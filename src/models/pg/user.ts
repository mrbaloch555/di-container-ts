import { Client } from "pg";
import { Model } from "../../database/base";
import { createPGTableIfNotExists } from "../../database/postgres";

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  created_at?: Date;
}

export class UserModel implements Model<User> {
  constructor(private client: Client) {
    createPGTableIfNotExists(
      client,
      `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `
    );
  }

  // Utility function to wrap PostgreSQL queries in Promises
  private async queryAsync(query: string, values: any[] = []): Promise<any> {
    try {
      const result = await this.client.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Implement the create method
  async create(user: User): Promise<boolean> {
    try {
      const query = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`;
      const values = [user.name, user.email, user.password];
      await this.queryAsync(query, values);
      console.log("User inserted successfully.");
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Implement the findAll method
  async findAll(): Promise<User[]> {
    try {
      const query = `SELECT * FROM users`;
      const results = await this.queryAsync(query);
      console.log("Users fetched successfully.");
      return results;
    } catch (error) {
      throw error;
    }
  }

  // Implement the findOne method
  async findOne(id: number): Promise<User | null> {
    try {
      const query = `SELECT * FROM users WHERE id = $1`;
      const results = await this.queryAsync(query, [id]);
      if (results.length === 0) {
        return null;
      }
      console.log("User fetched successfully.");
      return results[0];
    } catch (error) {
      throw error;
    }
  }

  // Implement the updateOne method
  async updateOne(id: number | string, user: User): Promise<User | null> {
    try {
      const query = `
        UPDATE users 
        SET name = $1, email = $2, password = $3 
        WHERE id = $4 
        RETURNING *;
      `;
      const values = [user.name, user.email, user.password, id];
      const results = await this.queryAsync(query, values);
      if (results.length === 0) {
        return null; // No rows updated
      }
      console.log("User updated successfully.");
      return results[0];
    } catch (error) {
      throw error;
    }
  }

  // Implement the deleteOne method
  async deleteOne(id: number | string): Promise<boolean> {
    try {
      const query = `DELETE FROM users WHERE id = $1 RETURNING *`;
      const results = await this.queryAsync(query, [id]);
      if (results.length === 0) {
        return false; // No rows deleted
      }
      console.log("User deleted successfully.");
      return true;
    } catch (error) {
      throw error;
    }
  }
}
