import { Client } from "pg";

// Connection string
const connectionString: string =
  "postgresql://FirstDatabase_owner:ZNlQk4q2JOei@ep-gentle-fire-a5bmvtbm.us-east-2.aws.neon.tech/FirstDatabase?sslmode=require";

// Create a new client
const client = new Client({
  connectionString: connectionString,
});

// Connect to the database
client
  .connect()
  .then(() => console.log("Connected to PostgreSQL database"))
  .catch((err) => console.error("Connection error", err.stack));

//creating a table if not created already
async function createUserTable() {
  try {
    const result = await client.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        `);
    console.log("Table created successfully");
  } catch (error) {
    console.error("Error creating user table", error);
  }
}

async function InsertData() {
  try {
    const query: string =
      "INSERT INTO users(username,email, password) VALUES ('nischal','nishchalb21@gmail.com','nischal@1234')";
    const result = await client.query(query);
    console.log(result, "Data inserted succesfully");
  } catch (error) {
    console.log("Error while adding data ", error);
  }
}
// InsertData();

// createUserTable();

//inserting data in a safer way such that it prevents sql injection

async function InsertSafe() {
  try {
    const query =
      "INSERT INTO users (username,email,password) VALUES ($1,$2,$3)";
    const values: [string, string, string] = [
      "nirman",
      "niraman3221@gmail.com",
      "sdhashdhfihudfs",
    ];
    const result = await client.query(query, values);
    console.log(result, "done successfuly");
  } catch (error) {
    console.log("Error occured !!!!", error);
  }
}

// InsertSafe();

// creating a relation between two tables  meaning using the above id as foreign key

async function CreateAddress() {
  try {
    const result = await client.query(`
      CREATE TABLE IF NOT EXISTS address(
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      city VARCHAR(100) NOT NULL,
      country VARCHAR(50) NOT NULL,
      street VARCHAR(100) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`);
    console.log("table created succesfully");
  } catch (error) {
    console.log(error);
  }
}

// CreateAddress();

// INSERT ADDRESS

async function addAddress() {
  try {
    const query =
      "INSERT INTO address (user_id,city, country, street) VALUES ($1, $2, $3,$4)";
    const values = [1, "Ramdhuni", "Nepal", "Milan Marga"];
    await client.query(query, values);
    console.log("Inserted successfully");
  } catch (error) {
    console.error("Error occured", error);
  }
}

// addAddress();

async function QueryDB() {
  const query = "SELECT * FROM users WHERE id=$1";
  const value = [1];
  const result = await client.query(query, value);
  console.log(result.rows);
}

// QueryDB();

// using joins

//types of joins
/*
 - > INNER JOIN excludes users without addresses.
 - > LEFT JOIN includes all users, filling in NULL for users without addresses.
 - > RIGHT JOIN includes all addresses even without users.
 - > FULL OUTER JOIN includes all users and addresses, with NULL where no match exists. 
 */

 
async function joinedQuery() {
  const query1 =
    "SELECT * FROM users JOIN address ON users.id=address.user_id WHERE users.id=1";
  // if ony desired certain fields values
  const query2 =
    "SELECT u.id, u.username, u.email, a.city, a.country FROM users u JOIN address a ON u.id=a.user_id WHERE u.id=1";
  const result = await client.query(query2);
  console.log(result.rows);
}

joinedQuery();
