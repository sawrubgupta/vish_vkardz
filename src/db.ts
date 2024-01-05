import mysql from "mysql2";
import 'dotenv/config';


const pool = mysql.createPool({
  host: process.env.HOST || "localhost", //"151.106.125.161", // //database-1.c8nty4yxdhpq.ap-south-1.rds.amazonaws.com",// //"194.31.52.223",
  user: process.env.USER || "root", //"vkar_staging1", //,//"admin", //"root", //"vkar_vkardz",
  password: process.env.PASSWORD || "",//"GfCudy6C9CGDOd#!", //"lnbc100n1p" , //"sOMAIqlIqrhzp!@4",
  database: process.env.DATABASE || "vkardz_staging", //"vkar_staging1", //"vkar_staging1",//"furball",//"vkardz_new", //"vkar_vkardz"wo
  connectTimeout: 100000,

  /**
   * The maximum number of connection requests the pool will queue before returning an error from getConnection. If set to 0, there
   * is no limit to the number of queued connection requests. (Default: 0)
   */
  //      queueLimit?: ;

});

// const pool = mysql.createPool({
//   host: "151.106.32.22",
//   user: "skfinyqs_dg",
//   password: "]?@qp6Ej0}sl",
//   database: "skfinyqs_dg",
//   port: 3306,
//   connectTimeout: 100000,

// });

pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log("Database is connected successfully !");
  connection.release();
});

export default pool.promise();
