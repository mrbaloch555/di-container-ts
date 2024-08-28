import mysql from "mysql";

// Function to create a MySQL connection and handle database setup
export const connectMYSQL = async (): Promise<mysql.Connection> => {
  try {
    // Create initial connection to MySQL server without selecting a database
    const initialConnection = mysql.createConnection({
      host: process.env.MYSQL_HOST || "localhost",
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
    });

    // Return a promise that resolves with the connection
    return new Promise((resolve, reject) => {
      initialConnection.connect((err) => {
        if (err) {
          console.error("Error connecting to MySQL:", err.message);
          reject(err);
        } else {
          console.log("Connected to MySQL server.");

          // Create the database if it does not exist
          createDatabaseIfNotExists(
            initialConnection,
            process.env.MYSQL_DBNAME!,
            () => {
              // Close the initial connection after creating the database
              initialConnection.end((err) => {
                if (err) {
                  console.error(
                    "Error closing initial connection:",
                    err.message
                  );
                  reject(err);
                } else {
                  // Create a new connection with the database selected
                  const connectionWithDB = mysql.createConnection({
                    host: process.env.MYSQL_HOST || "localhost",
                    user: process.env.MYSQL_USER,
                    password: process.env.MYSQL_PASSWORD,
                    database: process.env.MYSQL_DBNAME,
                  });

                  connectionWithDB.connect((err) => {
                    if (err) {
                      console.error(
                        "Error connecting to MySQL with the database selected:",
                        err.message
                      );
                      reject(err);
                    } else {
                      console.log(
                        `Connected to MySQL database ${process.env.MYSQL_DBNAME}.`
                      );
                      resolve(connectionWithDB); // Resolve the promise with the connection
                    }
                  });
                }
              });
            }
          );
        }
      });
    });
  } catch (error) {
    console.error("Error in connecting to MySQL:", error);
    throw error;
  }
};

// Function to create a database if it does not exist
const createDatabaseIfNotExists = (
  connection: mysql.Connection,
  dbName: string,
  callback: () => void
) => {
  const createDbQuery = `CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`;

  // Run the query to create the database
  connection.query(createDbQuery, (err, _) => {
    if (err) {
      console.error("Error creating database:", err.message);
      throw err;
    } else {
      console.log(`Database '${dbName}' created or already exists.`);
      callback(); // Call the callback function after the database is created
    }
  });
};

// Function to create a MySQL table if it does not exist
export const createMySQLTableIfNotExists = (
  connection: mysql.Connection,
  query: string
) => {
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error creating table:", err.message);
      throw err;
    } else {
      // connection.query("DROP tasks;");
      console.log("Table created or already exists.");
    }
  });
};
