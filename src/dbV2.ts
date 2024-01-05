import mysql from "mysql2";
import 'dotenv/config';

const pool = mysql.createPool({
  host: process.env.HOST || "vkardz.crarxhyujbuq.ap-south-1.rds.amazonaws.com",//,
  user: process.env.USER || "admin",// 
  password: process.env.PASSWORD || "8TUTn9O1UOit8Z4DkSvs",//  ,
  database: process.env.DATABASE || "vkar_v2test", //digital_vkardz", // 
  connectTimeout: 100000,

});

pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log("Database V2 is connected successfully !");
  connection.release();
});

export default pool.promise();
