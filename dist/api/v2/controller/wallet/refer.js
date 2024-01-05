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
exports.referCoinHistory = exports.useReferCode = exports.checkReferCode = void 0;
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const development_1 = __importDefault(require("../../config/development"));
const checkReferCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const referralCode = req.query.referralCode;
        const sql = `SELECT referral_code FROM users WHERE referral_code = ?`;
        const VALUES = [referralCode];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
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
        return apiResponse.successResponse(res, "In process", null);
        const sql = `SELECT id, referral_code, offer_coin FROM users WHERE referral_code = ?`;
        const VALUES = [referralCode];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        const refereeSql = `SELECT offer_coin FROM users WHERE id = ${userId} LIMIT 1`;
        const [refereeRows] = yield dbV2_1.default.query(refereeSql);
        if (rows.length === 0) {
            return apiResponse.errorMessage(res, 400, "Invalid Refferal Code");
        }
        const referAmountSql = `SELECT * FROM vkoin_limit LIMIT 1`;
        const [referAmountRows] = yield dbV2_1.default.query(referAmountSql);
        const offerCoin = rows[0].offer_coin + referAmountRows[0].referrer_coin;
        const refereeCoin = refereeRows[0].offer_coin + referAmountRows[0].referee_coin;
        const addreferral = `INSERT INTO referrals(user_id, referrer_user_id, refer_code, created_at) VALUES(?, ?, ?, ?)`;
        const referVALUES = [userId, rows[0].id, referralCode, createdAt];
        const [referRows] = yield dbV2_1.default.query(addreferral, referVALUES);
        // const coinSql = `INSERT INTO user_coins(user_id, type, coin, used_coin_amount, coin_status, created_at, expired_at) VALUES(?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?)`;
        // const coinVALUES = [rows[0].id, config.referrerType, referAmountRows[0].referrer_coin, 0, config.activeStatus, createdAt, extendedDate[0], userId, config.refereeType, referAmountRows[0].referee_coin, 0, config.activeStatus, createdAt, extendedDate[0]];
        // const [coinRows]:any = await pool.query(coinSql, coinVALUES);
        const coinSql = `INSERT INTO user_coins(user_id, type, coin, used_coin_amount, coin_status, created_at, expired_at) VALUES(?, ?, ?, ?, ?, ?, ?)`;
        const coinVALUES = [rows[0].id, development_1.default.referrerType, referAmountRows[0].referrer_coin, 0, development_1.default.activeStatus, createdAt, extendedDate[0]];
        const [coinRows] = yield dbV2_1.default.query(coinSql, coinVALUES);
        if (coinRows.affectedRows > 0) {
            const updateReferreData = `UPDATE users SET offer_coin = offer_coin + ${offerCoin} WHERE id = ${rows[0].id}`;
            const [data] = yield dbV2_1.default.query(updateReferreData);
            // const updateRefereeData = `UPDATE users SET offer_coin = offer_coin + ${refereeCoin} WHERE id = ${userId}`;
            // const [refereeRows]:any = await pool.query(updateRefereeData);
            return apiResponse.successResponse(res, "success", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to verify refer code, Contact support!!");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.useReferCode = useReferCode;
// ====================================================================================================
// ====================================================================================================
const referCoinHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = res.locals.jwt.userId;
        var getPage = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page)
            page = 1;
        var page_size = development_1.default.pageSize;
        const offset = (page - 1) * page_size;
        const getPageQuery = `SELECT COUNT(user_coins.id) AS length FROM user_coins LEFT JOIN users ON users.id = user_coins.user_id WHERE user_coins.user_id = ${userId} AND user_coins.type = '${development_1.default.referrerType}'`;
        const [result] = yield dbV2_1.default.query(getPageQuery);
        const sql = `SELECT user_coins.id, user_coins.type, user_coins.coin, user_coins.used_coin_amount, user_coins.coin_status, user_coins.created_at, user_coins.expired_at,users.username, users.name, users.referral_code, users.offer_coin FROM user_coins LEFT JOIN users ON users.id = user_coins.user_id WHERE user_coins.user_id = ${userId} AND user_coins.type = '${development_1.default.referrerType}' ORDER BY user_coins.created_at DESC LIMIT ${page_size} OFFSET ${offset}`;
        const [rows] = yield dbV2_1.default.query(sql);
        const referCodeSql = `SELECT referral_code FROM users WHERE id = ${userId} LIMIT 1`;
        const [referRows] = yield dbV2_1.default.query(referCodeSql);
        let totalPages = result[0].length / page_size;
        let totalPage = Math.ceil(totalPages);
        let totalLength = result[0].length;
        // rows.referCode = referRows[0]?.referral_code ?? "";
        const referCode = (_b = (_a = referRows[0]) === null || _a === void 0 ? void 0 : _a.referral_code) !== null && _b !== void 0 ? _b : "";
        var resData = {
            status: true,
            data: rows,
            totalPage: totalPage,
            currentPage: page,
            totalLength: totalLength,
            referCode: referCode,
            message: "Data Retrieved Successfully",
        };
        return res.status(200).json(resData);
        // return apiResponse.successResponseWithPagination(res, "Data Retrieved Successfully", rows, totalPage, page, totalLength);
    }
    catch (e) {
        console.log(e);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.referCoinHistory = referCoinHistory;
// ====================================================================================================
// ====================================================================================================
