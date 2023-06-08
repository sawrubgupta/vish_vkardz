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
exports.sendNotification = exports.getNotification = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
// import { dateWithFormat } from "../utility/utility";
// import fcmSend from "../../helper/notification";
const development_1 = __importDefault(require("../../config/development"));
const notify = __importStar(require("../../helper/notification"));
const getNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        let keyword = req.query.keyword;
        var getPage = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page) {
            page = 1;
        }
        var page_size = development_1.default.pageSize;
        const offset = (page - 1) * page_size;
        const getPageQuery = `SELECT id FROM notifications WHERE user_id = ${userId}`;
        const [result] = yield db_1.default.query(getPageQuery);
        const sql = `SELECT * FROM notifications WHERE user_id = ${userId} ORDER BY created_at desc limit ${page_size} offset ${offset}`;
        const [rows] = yield db_1.default.query(sql);
        let totalPages = result.length / page_size;
        let totalPage = Math.ceil(totalPages);
        if (rows.length > 0) {
            // return apiResponse.successResponse(res, "Products details are here", rows);
            return res.status(200).json({
                status: true,
                data: rows,
                totalPage: totalPage,
                currentPage: page,
                totalLength: result.length,
                message: "Products details are here"
            });
        }
        else {
            return apiResponse.errorMessage(res, 400, "Data not found");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.getNotification = getNotification;
// ====================================================================================================
// ====================================================================================================
const sendNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        const notificationData = req.body.notification;
        const sendTo = req.body.sendTo;
        let fcmTokens = [];
        let fcmSql;
        if (sendTo === development_1.default.allUsers) {
            fcmSql = `SELECT fcm_token FROM users WHERE deleted_at IS NULL`;
        }
        else if (sendTo === development_1.default.activateUsers) {
            fcmSql = `SELECT fcm_token FROM users WHERE deleted_at IS NULL AND (card_number IS NOT NULL OR card_number != '')`;
        }
        else if (sendTo === development_1.default.deactivateUsers) {
            fcmSql = `SELECT fcm_token FROM users WHERE deleted_at IS NULL AND (card_number IS NULL OR card_number = '')`;
        }
        else if (sendTo === development_1.default.basicPlan) {
            fcmSql = `SELECT fcm_token FROM users WHERE deleted_at IS NULL AND account_type = 16`;
        }
        else if (sendTo === development_1.default.propersonalizePlan) {
            fcmSql = `SELECT fcm_token FROM users WHERE deleted_at IS NULL AND account_type = 18`;
        }
        else {
            fcmSql = `SELECT fcm_token FROM users WHERE deleted_at IS NULL`;
        }
        const [rows] = yield db_1.default.query(fcmSql);
        try {
            // console.log("rows", rows);
            for (var _d = true, rows_1 = __asyncValues(rows), rows_1_1; rows_1_1 = yield rows_1.next(), _a = rows_1_1.done, !_a;) {
                _c = rows_1_1.value;
                _d = false;
                try {
                    const ele = _c;
                    fcmTokens.push(ele.fcm_token);
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
        var payload = notificationData.payload;
        var sendData = {
            title: notificationData.data.title,
            body: notificationData.data.body
        };
        // console.log("fcmTokens", fcmTokens);
        const result = yield notify.fcmSend(sendData, fcmTokens, payload);
        return apiResponse.successResponse(res, "Notification send successfully", null);
    }
    catch (error) {
        console.log("error", error);
    }
});
exports.sendNotification = sendNotification;
