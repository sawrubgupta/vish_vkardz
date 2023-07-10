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
exports.useReferCode = exports.checkReferCode = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const development_1 = __importDefault(require("../../config/development"));
const checkReferCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const referralCode = req.body.referralCode;
        const sql = `SELECT referral_code FROM users WHERE referral_code = ?`;
        const VALUES = [referralCode];
        const [rows] = yield db_1.default.query(sql, VALUES);
        if (rows.length > 0) {
            return apiResponse.successResponse(res, "Referral Code Verified Successfully", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Invalid Refferal Code");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.checkReferCode = checkReferCode;
// ====================================================================================================
// ====================================================================================================
const useReferCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const referralCode = req.body.referralCode;
        const createdAt = utility.dateWithFormat();
        const extendedDate = utility.extendedDateAndTime("monthly");
        const sql = `SELECT id, referral_code, offer_coin FROM users WHERE referral_code = ?`;
        const VALUES = [referralCode];
        const [rows] = yield db_1.default.query(sql, VALUES);
        const refereeSql = `SELECT offer_coin FROM users WHERE id = ${userId} LIMIT 1`;
        const [refereeRows] = yield db_1.default.query(refereeSql);
        if (rows.length === 0) {
            return apiResponse.errorMessage(res, 400, "Invalid Refferal Code");
        }
        const referAmountSql = `SELECT * FROM vkoin_limit LIMIT 1`;
        const [referAmountRows] = yield db_1.default.query(referAmountSql);
        const offerCoin = rows[0].offer_coin + referAmountRows[0].referrer_coin;
        const refereeCoin = refereeRows[0].offer_coin + referAmountRows[0].referee_coin;
        const addreferral = `INSERT INTO referrals(user_id, referrer_user_id, refer_code, created_at) VALUES(?, ?, ?, ?)`;
        const referVALUES = [userId, rows[0].id, referralCode, createdAt];
        const [referRows] = yield db_1.default.query(addreferral, referVALUES);
        const coinSql = `INSERT INTO user_coins(user_id, type, coin, used_coin_amount, coin_status, created_at, expired_at) VALUES(?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?)`;
        const coinVALUES = [rows[0].id, development_1.default.referrerType, referAmountRows[0].referrer_coin, 0, development_1.default.activeStatus, createdAt, extendedDate[0], userId, development_1.default.refereeType, referAmountRows[0].referee_coin, 0, development_1.default.activeStatus, createdAt, extendedDate[0]];
        const [coinRows] = yield db_1.default.query(coinSql, coinVALUES);
        if (coinRows.affectedRows > 0) {
            const updateReferreData = `UPDATE users SET offer_coin = offer_coin + ${offerCoin} WHERE id = ${rows[0].id}`;
            const [data] = yield db_1.default.query(updateReferreData);
            const updateRefereeData = `UPDATE users SET offer_coin = offer_coin + ${refereeCoin} WHERE id = ${userId}`;
            const [refereeRows] = yield db_1.default.query(updateRefereeData);
            return apiResponse.successResponse(res, "success", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to verify refer code, Contact support!!");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrongr");
    }
});
exports.useReferCode = useReferCode;
// ====================================================================================================
// ====================================================================================================
