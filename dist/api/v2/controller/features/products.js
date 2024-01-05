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
exports.deleteProduct = exports.updateProduct = exports.getProducts = exports.addProduct = void 0;
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const development_1 = __importDefault(require("../../config/development"));
const responseMsg_1 = __importDefault(require("../../config/responseMsg"));
const productsResMsg = responseMsg_1.default.features.products;
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId;
        const type = req.body.type; //type = business, user, null
        const profileId = req.body.profileId;
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.body.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, productsResMsg.addProducts.nullUserId);
        if (!profileId || profileId === null)
            return apiResponse.errorMessage(res, 400, productsResMsg.addProducts.nullProfileId);
        const createdAt = utility.dateWithFormat();
        const { title, description, price, image, currencyCode } = req.body;
        const limitSql = `SELECT * FROM user_limitations WHERE type = '${development_1.default.productType}' AND status = 1 LIMIT 1`;
        const [limitRows] = yield dbV2_1.default.query(limitSql);
        const productLimit = (_b = (_a = limitRows[0]) === null || _a === void 0 ? void 0 : _a.limitation) !== null && _b !== void 0 ? _b : 50;
        const productCountSql = `SELECT COUNT(id) AS totalProduct FROM services WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [productCountRows] = yield dbV2_1.default.query(productCountSql);
        if (productCountRows[0].totalProduct >= productLimit)
            return apiResponse.errorMessage(res, 400, `Profile limit reached. You can only have a maximum of ${productLimit} Products.`);
        const sql = `INSERT INTO services(user_id, profile_id, title, images, overview, price, currency_code, status, created_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const VALUES = [userId, profileId, title, image, description, price, currencyCode, 1, createdAt];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, productsResMsg.addProducts.successMsg, null);
        }
        else {
            return apiResponse.errorMessage(res, 400, productsResMsg.addProducts.failedMsg);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.addProduct = addProduct;
// ====================================================================================================
// ====================================================================================================
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId;
        const type = req.query.type; //type = business, user, null
        const profileId = req.query.profileId;
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.query.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, productsResMsg.getProducts.nullUserId);
        if (!profileId || profileId === null)
            return apiResponse.errorMessage(res, 400, productsResMsg.getProducts.nullProfileId);
        const userSql = `SELECT phone FROM users WHERE id = ${userId} LIMIT 1`;
        const [userRows] = yield dbV2_1.default.query(userSql);
        const userPhone = userRows[0].phone;
        var getPage = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page) {
            page = 1;
        }
        var page_size = development_1.default.pageSize;
        const offset = (page - 1) * page_size;
        const getPageQuery = `SELECT id, title, overview as description, images, price, status FROM services WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [result] = yield dbV2_1.default.query(getPageQuery);
        const sql = `SELECT id, title, overview as description, currency_code, images, price, status FROM services WHERE user_id = ${userId} AND profile_id = ${profileId} ORDER BY created_at DESC LIMIT ${page_size} OFFSET ${offset}`;
        const [rows] = yield dbV2_1.default.query(sql);
        let totalPages = result.length / page_size;
        let totalPage = Math.ceil(totalPages);
        const getFeatureStatus = `SELECT status FROM users_features WHERE user_id = ${userId} AND profile_id = ${profileId} AND feature_id = 5`;
        const [featureStatus] = yield dbV2_1.default.query(getFeatureStatus);
        if (rows.length > 0) {
            // return apiResponse.successResponse(res, "Data Retrieved Successflly", rows);
            return res.status(200).json({
                status: true,
                data: rows,
                userPhone,
                featureStatus: featureStatus[0].status,
                totalPage: totalPage,
                currentPage: page,
                totalLength: result.length,
                message: productsResMsg.getProducts.successMsg
            });
        }
        else {
            // return apiResponse.successResponse(res, "No Data Found", null);
            return res.status(200).json({
                status: true,
                data: null,
                userPhone,
                featureStatus: featureStatus[0].status,
                totalPage: totalPage,
                currentPage: page,
                totalLength: result.length,
                message: productsResMsg.getProducts.noDataFoundMsg
            });
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.getProducts = getProducts;
// ====================================================================================================
// ====================================================================================================
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId;
        const type = req.body.type; //type = business, user, null
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.body.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, productsResMsg.updateProduct.nullUserId);
        const { profileId, productId, title, description, price, image, currencyCode } = req.body;
        const sql = `UPDATE services SET title = ?, overview = ?, price = ?, currency_code = ?, images = ? WHERE user_id = ? AND id = ?`;
        const VALUES = [title, description, price, currencyCode, image, userId, productId];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, productsResMsg.updateProduct.successMsg, null);
        }
        else {
            return apiResponse.errorMessage(res, 400, productsResMsg.updateProduct.failedMsg);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.updateProduct = updateProduct;
// ====================================================================================================
// ====================================================================================================
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId;
        const type = req.query.type; //type = business, user, null
        // const profileId = req.query.profileId;
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.query.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, productsResMsg.deleteProduct.nullUserId);
        const productId = req.query.productId;
        const sql = `DELETE FROM services WHERE user_id = ? AND id = ?`;
        const VALUES = [userId, productId];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        return apiResponse.successResponse(res, productsResMsg.deleteProduct.successMsg, null);
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.deleteProduct = deleteProduct;
// ====================================================================================================
// ====================================================================================================
