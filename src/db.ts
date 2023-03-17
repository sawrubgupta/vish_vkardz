import mysql from "mysql2";
import 'dotenv/config';

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost", //"194.31.52.223",
  user: process.env.DB_USER || "root", //"vkar_vkardz",
  password: process.env.DB_PASSWORD || "" , //"sOMAIqlIqrhzp!@4",
  database: process.env.DATABASE || "vkardz_new", //"vkar_vkardz"wo
  connectTimeout: 10000
});

// const pool = mysql.createPool({
//   host: "194.31.52.223",
//   user: "vkar_staging1",
//   password: "GfCudy6C9CGDOd#!",
//   database: "vkar_staging1"
// });

pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log("Database is connected successfully !");
  connection.release();
});

export default pool.promise();
