import mysql from "mysql2";
import 'dotenv/config';

const pool = mysql.createPool({
  host: process.env.HOST || "localhost", //"194.31.52.223",
  user: process.env.USER || "root", //"vkar_vkardz",
  password: process.env.PASSWORD || "" , //"sOMAIqlIqrhzp!@4",
  database: process.env.DATABASE || "vkardz_new", //"vkar_vkardz"wo
  //connectTimeout: 10000,
  connectionLimit: 100

        /**
         * The maximum number of connection requests the pool will queue before returning an error from getConnection. If set to 0, there
         * is no limit to the number of queued connection requests. (Default: 0)
         */
  //      queueLimit?: ;
  
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
