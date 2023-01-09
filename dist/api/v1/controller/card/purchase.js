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
exports.cardPurchase = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const cardPurchase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        const userId = res.locals.jwt.userId;
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !");
        }
        // const isReturnPolicyAccepted = req.body.isReturnPolicyAccepted;
        // if (isReturnPolicyAccepted === 0) {
        //     return apiResponse.errorMessage(res, 400, "Please Accept return policy");
        // }
        const createdAt = utility.dateWithFormat();
        var paymentType = '';
        const { orderType, isGiftEnable, giftMessage } = req.body;
        if (orderType !== "online" && orderType !== "offline") {
            return apiResponse.errorMessage(res, 400, "Order type not define");
        }
        // let reedemCoinStatus = req.body.coinReedem;
        // let coins = req.body.reedemCoins.coins;
        const deliveryDetails = req.body.deliveryDetails;
        const paymentInfo = req.body.paymentInfo;
        const orderlist = req.body.orderlist;
        let rows;
        // if (reedemCoinStatus === true) {
        //     if (coins > 400) {
        //         coins = 400;
        //     }
        //     const reedemCoinQuery = `INSERT INTO reedem_coins (user_id, coins, created_at) VALUES (?, ?, ?)`
        //     const coinVALUES = [userId, coins, createdAt];
        //     const [coinRows]:any = await pool.query(reedemCoinQuery, coinVALUES);
        // }
        if (orderType === "online") {
            if (paymentInfo.paymentType === "stripe") {
                paymentType = '2';
            }
            else if (paymentInfo.paymentType === "razorpay") {
                paymentType = '3';
            }
            else if (paymentInfo.paymentType === "paypal") {
                paymentType = '4';
            }
            else {
                paymentType = '1';
            }
            const sql = `INSERT INTO all_payment_info(txn_id, user_id, username, email, currency_code, price, name, phone_number, locality, country, city, address, pincode, contact_info, delivery_charges, payment_type, vat_num, note, is_gift_enable, gift_message, status, created_at, approve_time) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const VALUES = [paymentInfo.txnId, userId, paymentInfo.username, paymentInfo.email, paymentInfo.price_currency_code, paymentInfo.price, deliveryDetails.name, deliveryDetails.phoneNumber, deliveryDetails.locality, deliveryDetails.country, deliveryDetails.city, deliveryDetails.address, deliveryDetails.pincode, deliveryDetails.email, paymentInfo.deliveryCharge, paymentType, deliveryDetails.vat_number, paymentInfo.note, isGiftEnable, giftMessage, paymentInfo.status, createdAt, '0000-00-00 00:00:00'];
            [rows] = yield db_1.default.query(sql, VALUES);
        }
        else {
            const randomAlhpa = utility.randomString(4);
            const randomNum = Math.floor(Math.random() * (9999 - 1000));
            const offlineTrx = 'op-' + randomAlhpa + '-' + randomNum;
            const paymentType = 1;
            const offlineSql = `INSERT INTO all_payment_info(user_id, txn_id, username, email, currency_code, price, name, phone_number, locality, country, city, address, pincode, contact_info, delivery_charges, payment_type, vat_num, note, is_gift_enable, gift_message, status, created_at, approve_time) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const offlineVALUES = [userId, offlineTrx, paymentInfo.username, paymentInfo.email, paymentInfo.price_currency_code, paymentInfo.price, deliveryDetails.name, deliveryDetails.phoneNumber, deliveryDetails.locality, deliveryDetails.country, deliveryDetails.city, deliveryDetails.address, deliveryDetails.pincode, deliveryDetails.email, paymentInfo.deliveryCharge, paymentType, deliveryDetails.vat_number, paymentInfo.note, isGiftEnable, giftMessage, paymentInfo.status, createdAt, '0000-00-00 00:00:00'];
            [rows] = yield db_1.default.query(offlineSql, offlineVALUES);
        }
        const paymentId = rows.insertId;
        let orderListSql = `INSERT INTO orderlist(user_id, order_id, product_id, qty, sub_total, created_at) VALUES `;
        let result = "";
        if (rows.affectedRows > 0) {
            try {
                for (var _d = true, orderlist_1 = __asyncValues(orderlist), orderlist_1_1; orderlist_1_1 = yield orderlist_1.next(), _a = orderlist_1_1.done, !_a;) {
                    _c = orderlist_1_1.value;
                    _d = false;
                    try {
                        const element = _c;
                        const productId = element.product_id;
                        const qty = element.qty;
                        const subTotal = element.sub_total;
                        const orderId = rows.insertId;
                        orderListSql = orderListSql + `(${userId}, ${orderId}, ${productId}, ${qty}, '${subTotal}', '${createdAt}'),`;
                        result = orderListSql.substring(0, orderListSql.lastIndexOf(','));
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = orderlist_1.return)) yield _b.call(orderlist_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            const [data] = yield db_1.default.query(result);
            if (data.affectedRows > 0) {
                // return apiResponse.successResponse(res, "Purchase Successfully!", null);
                return res.status(200).json({
                    status: true,
                    data: null,
                    paymentId: paymentId,
                    message: "Purchase Successfully!"
                });
            }
            else {
                return apiResponse.errorMessage(res, 400, "Something went wrong,please try again  later or contact our support team");
            }
        }
        else {
            return apiResponse.errorMessage(res, 400, "Purchase Failed, Please try again");
        }
    }
    catch (error) {
        console.log(error);
        return yield apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.cardPurchase = cardPurchase;
// ====================================================================================================
// ====================================================================================================
