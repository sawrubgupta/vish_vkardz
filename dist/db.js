"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
require("dotenv/config");
const pool = mysql2_1.default.createPool({
    host: process.env.HOST || "151.106.125.161",
    user: process.env.USER || "vkar_staging1",
    password: process.env.PASSWORD || "GfCudy6C9CGDOd#!",
    database: process.env.DATABASE || "vkar_staging1",
    connectTimeout: 10000,
    /**
     * The maximum number of connection requests the pool will queue before returning an error from getConnection. If set to 0, there
     * is no limit to the number of queued connection requests. (Default: 0)
     */
    //      queueLimit?: ;
});
// const pool = mysql.createPool({
//   host: "151.106.125.161",
//   user: "vkar_staging1",
//   password: "GfCudy6C9CGDOd#!",
//   database: "vkar_staging1"
// });
pool.getConnection((err, connection) => {
    if (err)
        throw err;
    console.log("Database is connected successfully !");
    connection.release();
});
exports.default = pool.promise();
