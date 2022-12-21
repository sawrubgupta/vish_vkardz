import mysql from "mysql2";
import 'dotenv/config';

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DATABASE || "vkardz_new", 
});

pool.getConnection((err: any, connection: any) => {
  if (err) throw err;
  console.log("Database is connected successfully !");
  connection.release();
});

export default pool.promise();
