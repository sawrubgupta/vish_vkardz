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
exports.orderSummary = exports.cancelOrder = exports.orderHistory = void 0;
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const development_1 = __importDefault(require("../../config/development"));
const responseMsg_1 = __importDefault(require("../../config/responseMsg"));
const orderResMsg = responseMsg_1.default.orders.order;
const orderHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        console.log("userId", userId);
        const sql = `SELECT api.id AS orderId, api.created_at, api.payment_type, api.delivery_date, api.expected_date, p.product_image, p.product_id AS productId, p.name AS productName, p.slug, api.price, ol.qty, api.name, api.address, api.locality, api.city, api.country, api.phone_number, api.delivery_charges, api.cod, api.price AS totalPrice, api.price, api.status, api.order_status, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM all_payment_info AS api LEFT JOIN orderlist AS ol ON ol.order_id = api.id LEFT JOIN products AS p ON ol.product_id = p.product_id LEFT JOIN product_price ON p.product_id = product_price.product_id LEFT JOIN product_rating ON p.product_id = product_rating.product_id WHERE api.user_id = ${userId} AND api.order_type = '${development_1.default.productType}' GROUP BY api.id ORDER BY created_at DESC`;
        const [rows] = yield dbV2_1.default.query(sql);
        console.log("rows", rows);
        const ongoingOrder = [];
        const deliveredOrder = [];
        const cancelOrder = [];
        if (rows.length > 0) {
            let productIdsArr = [];
            let rowsIndex = -1;
            for (const iterator of rows) {
                let productId = iterator.productId;
                productIdsArr.push(productId);
                rowsIndex++;
                if (iterator.order_status === 'delivered') {
                    deliveredOrder.push(iterator);
                }
                else if (iterator.order_status === 'canceled') {
                    cancelOrder.push(iterator);
                }
                else {
                    ongoingOrder.push(iterator);
                }
            }
            let uniqProductIdsArr = [...new Set(productIdsArr.filter((item) => item !== null))];
            const productImageSql = `SELECT product_id, image FROM product_image WHERE product_id IN(${uniqProductIdsArr})`;
            const [productImageRows] = yield dbV2_1.default.query(productImageSql);
            let rowIndex = -1;
            let imageDataIndex = -1;
            for (const element of rows) {
                rowIndex++;
                rows[rowIndex].productImg = [];
                for (const imgEle of productImageRows) {
                    imageDataIndex++;
                    if (element.productId === imgEle.product_id) {
                        (rows[rowIndex].productImg).push(imgEle.image);
                    }
                }
            }
            return res.status(200).json({
                status: true,
                ongoingOrder, deliveredOrder, cancelOrder,
                message: orderResMsg.orderHistory.successMsg
            });
            // return apiResponse.successResponse(res, "Data Rtrieved Successfully", rows);
        }
        else {
            return apiResponse.successResponse(res, orderResMsg.orderHistory.noDataFoundMsg, null);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.orderHistory = orderHistory;
// ====================================================================================================
// ====================================================================================================
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const orderId = req.body.orderId;
        // const checkOrder = `SELECT status FROM all_payment_info WHERE user_id = ${userId} AND id = ${orderId} LIMIT 1`;
        // const [orderRows]:any = await pool.query(checkOrder);
        // if (orderRows.status === 'dele') {
        // } else {
        // }
        const sql = `UPDATE all_payment_info SET order_status = 'canceled' WHERE user_id = ${userId} AND id = ${orderId}`;
        const [rows] = yield dbV2_1.default.query(sql);
        return apiResponse.successResponse(res, orderResMsg.cancelOrder.successMsg, null);
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.cancelOrder = cancelOrder;
// ====================================================================================================
// ====================================================================================================
const orderSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const orderId = req.query.orderId;
        if (!orderId || orderId === null || orderId === undefined)
            return apiResponse.errorMessage(res, 400, orderResMsg.orderSummary.invalidOrderId);
        // const sql = `SELECT all_payment_info.*, (price - delivery_charges - coupon_discount - gst_amount) AS itemsTotal FROM all_payment_info WHERE id = ${orderId} AND user_id = ${userId} LIMIT 1`;
        const sql = `SELECT all_payment_info.* FROM all_payment_info WHERE id = ${orderId} AND user_id = ${userId} LIMIT 1`;
        const [rows] = yield dbV2_1.default.query(sql);
        if (rows.length > 0) {
            const orderListSql = `SELECT orderlist.order_id, orderlist.qty, orderlist.product_id, orderlist.sub_total, SUM(orderlist.sub_total) as itemTotal, products.name, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM orderlist LEFT JOIN products ON products.product_id = orderlist.product_id LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE orderlist.user_id = ${userId} AND orderlist.order_id = ${orderId} GROUP BY products.product_id ORDER BY orderlist.created_at DESC`;
            const [orderRows] = yield dbV2_1.default.query(orderListSql);
            const userDetailQuery = `SELECT username, name, email, phone, country, thumb FROM users WHERE id = ${userId} LIMIT 1`;
            const [userRows] = yield dbV2_1.default.query(userDetailQuery);
            const addressQuery = `SELECT * FROM delivery_addresses WHERE user_id = ${userId} ORDER BY is_default = 1 DESC LIMIT 1`;
            const [addressRows] = yield dbV2_1.default.query(addressQuery);
            const orderStatusQuery = `SELECT * FROM order_tracking WHERE user_id = ${userId} AND order_id = ${orderId}`;
            const [orderStatusRows] = yield dbV2_1.default.query(orderStatusQuery);
            const orderStatus = development_1.default.orderStatus;
            rows[0].itemsTotal = parseInt(orderRows[0].itemTotal);
            rows[0].orderDetal = orderRows || [];
            rows[0].orderDetail = orderRows || [];
            rows[0].userDetail = userRows[0] || {};
            rows[0].addressDetail = addressRows[0] || {};
            rows[0].vKardzPhone = development_1.default.vKardzPhone;
            rows[0].orderStatus = orderStatusRows || [];
            rows[0].orderTrackingStatus = orderStatus;
            return apiResponse.successResponse(res, orderResMsg.orderSummary.successMsg, rows[0]);
        }
        else {
            return apiResponse.successResponse(res, orderResMsg.orderSummary.noDataFoundMsg, null);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.orderSummary = orderSummary;
// ====================================================================================================
// ====================================================================================================
