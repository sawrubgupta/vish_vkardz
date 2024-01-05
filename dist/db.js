"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
require("dotenv/config");
const pool = mysql2_1.default.createPool({
    host: process.env.HOST || "localhost",
    user: process.env.USER || "root",
    password: process.env.PASSWORD || "",
    database: process.env.DATABASE || "vkardz_staging",
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
    if (err)
        throw err;
    console.log("Database is connected successfully !");
    connection.release();
});
exports.default = pool.promise();
