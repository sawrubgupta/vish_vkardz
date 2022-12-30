"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
require("dotenv/config");
// const pool = mysql.createPool({
//   host: process.env.DB_HOST || "localhost", //"194.31.52.223",
//   user: process.env.DB_USER || "root", //"vkar_vkardz",
//   password: process.env.DB_PASSWORD || "" , //"sOMAIqlIqrhzp!@4",
//   database: process.env.DATABASE || "vkardz_new", //"vkar_vkardz"
// });
const pool = mysql2_1.default.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "vkardz_new"
});
pool.getConnection((err, connection) => {
    if (err)
        throw err;
    console.log("Database is connected successfully !");
    connection.release();
});
exports.default = pool.promise();
