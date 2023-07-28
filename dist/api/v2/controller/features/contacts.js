"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.captureLead = exports.exchangeContacts = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const exchangeContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, name, email, phone, message } = req.body;
        const createdAt = utility.dateWithFormat();
        const userSql = `SELECT id FROM users WHERE username = '${username}' LIMIT 1`;
        const [userRows] = yield db_1.default.query(userSql);
        if (userRows.length === 0)
            return apiResponse.errorMessage(res, 400, "Invalid username");
        const userId = userRows[0].id;
        const sql = `INSERT INTO exchange_contacts(user_id, name, email, phone, message, created_at) VALUES(?, ?, ?, ?, ?, ?)`;
        const VALUES = [userId, name, email, phone, message, createdAt];
        const [rows] = yield db_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Success", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed!, try again");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.exchangeContacts = exchangeContacts;
// ====================================================================================================
// ====================================================================================================
const captureLead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, name, email, phone, message } = req.body;
        const createdAt = utility.dateWithFormat();
        const userSql = `SELECT id FROM users WHERE username = '${username}' LIMIT 1`;
        const [userRows] = yield db_1.default.query(userSql);
        if (userRows.length === 0)
            return apiResponse.errorMessage(res, 400, "Invalid username");
        const userId = userRows[0].id;
        const sql = `INSERT INTO leads(user_id, name, email, phone, message, created_at) VALUES(?, ?, ?, ?, ?, ?)`;
        const VALUES = [userId, name, email, phone, message, createdAt];
        const [rows] = yield db_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Success", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed!, try again");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.captureLead = captureLead;
// ====================================================================================================
// ====================================================================================================
