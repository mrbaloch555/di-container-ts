import { Model } from "../../database/base";
import mysql from "mysql";
import { createMySQLTableIfNotExists } from "../../database/mysql";

interface Task {
  id?: number;
  body: string;
  priority: string;
  status: string;
  created_at?: Date;
}

export class TaskModel implements Model<Task> {
  constructor(private client: mysql.Connection) {
    createMySQLTableIfNotExists(
      client,
      `
        CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        body VARCHAR(500) NOT NULL,
        priority VARCHAR(255) NOT NULL,
        status VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `
    );
  }
  // Utility function to wrap MySQL queries in Promises
  private queryAsync(query: string, values: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.query(query, values, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  // Implement the create method
  async create(body: Task): Promise<boolean> {
    try {
      const query = `INSERT INTO tasks (body, priority, status) VALUES (?, ?, ?)`;
      const values = [body.body, body.priority, body.status];
      await this.queryAsync(query, values);
      console.log("Task inserted successfully.");
      return true;
    } catch (error) {
      console.error("Error inserting task:", error);
      throw error;
    }
  }

  // Implement the findAll method
  async findAll(params: any): Promise<Task[]> {
    try {
      const query = `SELECT * FROM tasks`;
      const results = await this.queryAsync(query);
      console.log("Tasks fetched successfully.");
      return results;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  // Implement the findOne method
  async findOne(params: any): Promise<Task | null> {
    try {
      const { id } = params;
      const query = `SELECT * FROM tasks WHERE id = ?`;
      const results = await this.queryAsync(query, [id]);
      if (results.length === 0) {
        return null;
      }
      console.log("Task fetched successfully.");
      return results[0];
    } catch (error) {
      console.error("Error fetching task:", error);
      throw error;
    }
  }

  // Implement the updateOne method
  async updateOne(id: string | number, body: Task): Promise<Task | null> {
    try {
      const query = `UPDATE tasks SET body = ?, priority = ?, status = ? WHERE id = ?`;
      const values = [body.body, body.priority, body.status, id];
      const results = await this.queryAsync(query, values);
      if (results.affectedRows === 0) {
        return null; // No rows updated
      }
      console.log("Task updated successfully.");
      return { id: Number(id), ...body }; // Return the updated task
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  // Implement the deleteOne method
  async deleteOne(id: string | number): Promise<boolean> {
    try {
      const query = `DELETE FROM tasks WHERE id = ?`;
      const results = await this.queryAsync(query, [id]);
      if (results.affectedRows === 0) {
        return false; // No rows deleted
      }
      console.log("Task deleted successfully.");
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }
}
