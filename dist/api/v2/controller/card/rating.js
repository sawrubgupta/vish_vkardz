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
exports.updateProductReviews = exports.reviewList = exports.productRating = void 0;
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const responseMsg_1 = __importDefault(require("../../config/responseMsg"));
const ratingResponseMsg = responseMsg_1.default.card.rating;
const productRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const { productId, rating, message } = req.body;
        const createdAt = utility.dateWithFormat();
        const checkProductBuySql = `SELECT id FROM orderlist WHERE user_id = ${userId} AND product_id = ${productId} LIMIT 1`;
        const [orderData] = yield dbV2_1.default.query(checkProductBuySql);
        if (orderData.length === 0)
            return apiResponse.errorMessage(res, 400, ratingResponseMsg.productRating.notBuy);
        const checkReviewSql = `SELECT id FROM product_rating WHERE user_id = ${userId} AND product_id = ${productId} LIMIT 1`;
        const [reviewData] = yield dbV2_1.default.query(checkReviewSql);
        if (reviewData.length > 0)
            return apiResponse.errorMessage(res, 400, ratingResponseMsg.productRating.alreadyReviewMsg);
        const sql = `INSERT INTO product_rating(user_id, product_id, rating, message, created_at) VALUES(?, ?, ?, ?, ?)`;
        const VALUES = [userId, productId, rating, message, createdAt];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, ratingResponseMsg.productRating.successMsg, null);
        }
        else {
            return apiResponse.errorMessage(res, 400, ratingResponseMsg.productRating.failedMsg);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.productRating = productRating;
// ====================================================================================================
// ====================================================================================================
const reviewList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.query.productId;
        if (!productId || productId === null || productId === undefined)
            return apiResponse.errorMessage(res, 400, ratingResponseMsg.reviewList.nullProductIdMsg);
        const sql = `SELECT product_rating.id AS reviewId, users.name, product_rating.rating, product_rating.message FROM product_rating LEFT JOIN users ON product_rating.user_id = users.id WHERE product_rating.product_id = ${productId}`;
        const [rows] = yield dbV2_1.default.query(sql);
        if (rows.length > 0) {
            return apiResponse.successResponse(res, ratingResponseMsg.reviewList.successMsg, rows);
        }
        else {
            return apiResponse.successResponse(res, ratingResponseMsg.reviewList.noDataFoundMsg, null);
        }
    }
    catch (e) {
        console.log(e);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.reviewList = reviewList;
// ====================================================================================================
// ====================================================================================================
const updateProductReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const { productId, rating, message } = req.body;
        const sql = `UPDATE product_rating SET rating = ?, message = ? WHERE user_id = ? AND product_id = ?`;
        const VALUES = [rating, message, userId, productId];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, ratingResponseMsg.updateProductReviews.successMsg, null);
        }
        else {
            return apiResponse.errorMessage(res, 400, ratingResponseMsg.updateProductReviews.failedMsg);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.updateProductReviews = updateProductReviews;
// ====================================================================================================
// ====================================================================================================
