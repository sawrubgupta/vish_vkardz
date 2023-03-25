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
exports.couponRedemptions = exports.coupnDiscount = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const coupnDiscount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const couponCode = req.query.couponCode;
        if (!couponCode || couponCode === "" || couponCode === undefined) {
            return apiResponse.errorMessage(res, 400, "Please enter a coupon code");
        }
        const createdAt = utility.dateWithFormat();
        const checkCouponCodeQuery = `SELECT coupon_code, discount_amount, discount_type FROM coupons WHERE coupon_code = ? AND expiration_date >= ?`;
        const VALUES = [couponCode, createdAt];
        console.log(VALUES);
        const [rows] = yield db_1.default.query(checkCouponCodeQuery, VALUES);
        if (rows.length === 0) {
            return apiResponse.errorMessage(res, 400, "Invalid Coupon Code!!");
        }
        else {
            const chekCodeUsedQuery = `SELECT id FROM coupon_redemptions WHERE coupon_code = ? AND customer_id = ?`;
            const codeVALUES = [couponCode, userId];
            const [data] = yield db_1.default.query(chekCodeUsedQuery, codeVALUES);
            if (data.length > 0) {
                return apiResponse.errorMessage(res, 400, "This coupon code is already used or has expired");
            }
            else {
                return apiResponse.successResponse(res, "Coupon Code Verified", rows[0]);
            }
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.coupnDiscount = coupnDiscount;
// ====================================================================================================
// ====================================================================================================
const couponRedemptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const { couponCode, totalDiscount } = req.body;
        const createdAt = utility.dateWithFormat();
        const checkCouponCodeQuery = `SELECT coupon_code, discount_amount, discount_type FROM coupons WHERE coupon_code = ? AND expiration_date >= ?`;
        const couponVALUES = [couponCode, createdAt];
        const [couponrows] = yield db_1.default.query(checkCouponCodeQuery, couponVALUES);
        if (couponrows.length === 0) {
            return apiResponse.errorMessage(res, 400, "Invalid Coupon Code!!");
        }
        const chekCodeUsedQuery = `SELECT id FROM coupon_redemptions WHERE coupon_code = ? AND customer_id = ?`;
        const codeVALUES = [couponCode, userId];
        const [data] = yield db_1.default.query(chekCodeUsedQuery, codeVALUES);
        if (data.length > 0) {
            return apiResponse.errorMessage(res, 400, "This coupon code is invalid or has expired");
        }
        const sql = `INSERT INTO coupon_redemptions(customer_id, coupon_code, total_discount, redemption_date) VALUES(?, ?, ?, ?)`;
        const VALUES = [userId, couponCode, totalDiscount, createdAt];
        const [rows] = yield db_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Coupon Redeem Sucessfully", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to reedem coupon");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.couponRedemptions = couponRedemptions;
// ====================================================================================================
// ====================================================================================================
