import { Client } from "pg";

// Function to connect to PostgreSQL
export const connectPG = async (): Promise<Client> => {
  try {
    // Initial connection to PostgreSQL server without a database
    const initialClient = new Client({
      host: process.env.PGHOST || "localhost", // Default to localhost if not specified
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      port: parseInt(process.env.PGPORT!) || 5432,
    });

    await initialClient.connect();
    console.log("Connected to PostgreSQL server.");

    // Create database if not exists
    await createDatabaseIfNotExists(initialClient, process.env.PG_DBNAME!);

    // Close the initial connection
    await initialClient.end();

    // Reconnect with the database specified
    const clientWithDB = new Client({
      host: process.env.PGHOST || "localhost",
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PG_DBNAME,
      port: parseInt(process.env.PGPORT!) || 5432,
    });

    await clientWithDB.connect();
    console.log(`Connected to PostgreSQL database ${process.env.PG_DBNAME}.`);

    return clientWithDB; // Return the connection with the database selected by default
  } catch (error) {
    console.error("Error connecting to PostgreSQL:", error);
    throw error;
  }
};

// Function to create a database if it does not exist
const createDatabaseIfNotExists = async (client: Client, dbName: string) => {
  try {
    // Check if database exists
    const checkDbQuery = `SELECT 1 FROM pg_database WHERE datname='${dbName}';`;
    const res = await client.query(checkDbQuery);

    if (res.rows.length === 0) {
      // Database does not exist, create it
      const createDbQuery = `CREATE DATABASE ${dbName};`;
      await client.query(createDbQuery);
      console.log(`Database '${dbName}' created.`);
    } else {
      console.log(`Database '${dbName}' already exists.`);
    }
  } catch (error) {
    throw error;
  }
};

// Function to create a table if it does not exist
export const createPGTableIfNotExists = async (
  client: Client,
  query: string
) => {
  try {
    await client.query(query);
    console.log("Table created or already exists.");
  } catch (error) {
    throw error;
  }
};
