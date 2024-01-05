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
exports.updatePackage = void 0;
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
//v4
const updatePackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const createdAt = utility.dateWithFormat();
        let paymentType = req.body.paymentType;
        const { txnId, priceCurrencyCode, packageSlug, price, status, packageType, couponDiscount, gstAmount } = req.body;
        const endDate = utility.extendedDateWithFormat(`${packageType}`);
        if (paymentType === "stripe") {
            paymentType = '2';
        }
        else if (paymentType === "razorpay") {
            paymentType = '3';
        }
        else if (paymentType === "paypal") {
            paymentType = '4';
        }
        else {
            paymentType = '1';
        }
        const userSql = `SELECT * FROM users WHERE id = ${userId} LIMIT 1`;
        const [userRows] = yield dbV2_1.default.query(userSql);
        if (userRows.length === 0)
            return apiResponse.errorMessage(res, 400, "User not found");
        const sql = `INSERT INTO all_payment_info(txn_id, user_id, username, email, package, currency_code, price, payment_type, coupon_discount, gst_amount, status, created_at, approve_time) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const VALUES = [txnId, userId, userRows[0].username, userRows[0].email, packageSlug, priceCurrencyCode, price, paymentType, couponDiscount, gstAmount, status, createdAt, '0000-00-00 00:00:00'];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            const checkPackageSql = `SELECT * FROM users_package WHERE user_id = ${userId} LIMIT 1`;
            const [packageData] = yield dbV2_1.default.query(checkPackageSql);
            let packageSql;
            let packageVALUES;
            if (packageData.length > 0) {
                packageSql = `UPDATE users_package SET package_slug = ?, start_time = ?, end_time = ?, expired_at = ?, updated_at = ? WHERE user_id = ?`;
                packageVALUES = [packageSlug, createdAt, endDate, endDate, createdAt, userId];
            }
            else {
                packageSql = `INSERT INTO users_package(user_id, package_slug, start_time, end_time, expired_at, created_at) VALUES(?, ?, ?, ?, ?, ?)`;
                packageVALUES = [userId, packageSlug, createdAt, endDate, endDate, createdAt];
            }
            const [packageRows] = yield dbV2_1.default.query(packageSql, packageVALUES);
            if (packageRows.affectedRows > 0) {
                return apiResponse.successResponse(res, "Package Updatesd Successfully", null);
            }
            else {
                return apiResponse.errorMessage(res, 400, "Failed to update package, Contact Support!");
            }
        }
        else {
            return apiResponse.errorMessage(res, 400, "Something Went Wrong, Contact Support!");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.updatePackage = updatePackage;
// ====================================================================================================
// ====================================================================================================
