"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
require("dotenv/config");
const pool = mysql2_1.default.createPool({
    host: process.env.HOST || "vkardz.crarxhyujbuq.ap-south-1.rds.amazonaws.com",
    user: process.env.USER || "admin",
    password: process.env.PASSWORD || "8TUTn9O1UOit8Z4DkSvs",
    database: process.env.DATABASE || "vkar_v2test",
    connectTimeout: 100000,
});
pool.getConnection((err, connection) => {
    if (err)
        throw err;
    console.log("Database V2 is connected successfully !");
    connection.release();
});
exports.default = pool.promise();
