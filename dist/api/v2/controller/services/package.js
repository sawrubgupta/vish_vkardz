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
exports.updatePackage = exports.getPackage = void 0;
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const getPackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const vari = ["Everything in vkardz", "Create Unlimited Profiles", "Link Profile to multiple cards", "Lifetime help & Support", "Unlimited Device Management", "Lifetime Analytics", "Link your card to an individual link"];
        // const str = vari.join();
        // console.log(str);
        const sql = `SELECT * FROM packages WHERE status = 1`;
        let [rows] = yield dbV2_1.default.query(sql);
        let index = -1;
        for (const iterator of rows) {
            index++;
            rows[index].details = iterator.details.split(',');
        }
        ;
        return apiResponse.successResponse(res, "Package list get Successfully", rows);
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Somethng Went Wrong");
    }
});
exports.getPackage = getPackage;
// ====================================================================================================
// ====================================================================================================
//old api   
const updatePackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const createdAt = utility.dateWithFormat();
        const endDate = utility.extendedDateWithFormat("yearly");
        // return apiResponse.errorMessage(res, 400, "not working");
        let paymentType = req.body.paymentType;
        const { txnId, priceCurrencyCode, price, status } = req.body;
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
        // username, email, name, phone_number, locality, country, city, address,pincode, contact_info, delivery_charges, vat_num, note, is_gift_enable, gift_message,
        const sql = `INSERT INTO service_buy_payment_info(txn_id, user_id, package, currency_code, price, payment_type, status, start_date, end_date, created_at, approve_time) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const VALUES = [txnId, userId, 18, priceCurrencyCode, price, paymentType, status, createdAt, endDate, createdAt, '0000-00-00 00:00:00'];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            const updateUser = ` UPDATE users SET account_type = ?, start_date = ?, end_date = ? WHERE id = ?`;
            const VALUES = [18, createdAt, endDate, userId];
            const [userRows] = yield dbV2_1.default.query(updateUser, VALUES);
            if (userRows.affectedRows > 0) {
                return apiResponse.successResponse(res, "Survice buy successfully", null);
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
