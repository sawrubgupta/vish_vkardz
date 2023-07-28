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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coinCron = void 0;
const db_1 = __importDefault(require("../../../../db"));
const utility = __importStar(require("../../helper/utility"));
const development_1 = __importDefault(require("../../config/development"));
const coinCron = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        const createdAt = utility.dateWithFormat();
        const currentDate = utility.getTimeAndDate();
        const date = currentDate[0];
        const sql = `SELECT * FROM user_coins WHERE expired_at = '${date}' AND coin_status = '${development_1.default.activeStatus}'`;
        const [rows] = yield db_1.default.query(sql);
        if (rows.length > 0) {
            try {
                // const updateSql = `UPDATE user_coins SET coin_status = ?, updated_at = ? WHERE expired_at = ?`;
                // const VALUES = [config.expiredStatus, createdAt, date];
                // const [updatedRows]:any = await pool.query(updateSql, VALUES);
                for (var _d = true, rows_1 = __asyncValues(rows), rows_1_1; rows_1_1 = yield rows_1.next(), _a = rows_1_1.done, !_a;) {
                    _c = rows_1_1.value;
                    _d = false;
                    try {
                        const ele = _c;
                        const expiredCoin = ele.coin - ele.used_coin_amount;
                        const updateSql = `INSERT INTO user_coins(user_id, type, coin, used_coin_amount, coin_status, created_at, expired_at) VALUES(?, ?, ?, ?, ?, ?, ?)`;
                        const VALUES = [ele.user_id, development_1.default.expiredStatus, ele.coin, ele.used_coin_amount, development_1.default.expiredStatus, createdAt, date];
                        const [updatedRows] = yield db_1.default.query(updateSql, VALUES);
                        if (updatedRows.affectedRows > 0) {
                            const updateUserSql = `UPDATE users SET offer_coin = offer_coin - ${expiredCoin} WHERE id = ${ele.user_id}`;
                            const [userRows] = yield db_1.default.query(updateUserSql);
                            console.log("Status Change Successfully");
                        }
                        else {
                            console.log("Failed to change status");
                        }
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = rows_1.return)) yield _b.call(rows_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        else {
            console.log("Eempty Rows");
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.coinCron = coinCron;
// ====================================================================================================
// ====================================================================================================
