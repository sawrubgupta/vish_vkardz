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
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const development_1 = __importDefault(require("../../config/development"));
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId;
        const type = req.query.type; //type = business, user, null
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.query.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "User Id is required!");
        }
        const createdAt = utility.dateWithFormat();
        const { title, description, price, image, currencyCode } = req.body;
        const sql = `INSERT INTO services(user_id, title, images, overview, price, currency_code, status, created_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;
        const VALUES = [userId, title, image, description, price, currencyCode, 1, createdAt];
        const [rows] = yield db_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Product Added Successfully", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to add product, try again");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
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
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType)) {
            userId = req.query.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "User Id is required!");
        }
        var getPage = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page) {
            page = 1;
        }
        var page_size = development_1.default.pageSize;
        const offset = (page - 1) * page_size;
        const userSql = `SELECT phone FROM users WHERE id = ${userId} LIMIT 1`;
        const [userRows] = yield db_1.default.query(userSql);
        const userPhone = userRows[0].phone;
        const getPageQuery = `SELECT id, title, overview as description, images, price, status FROM services WHERE user_id = ${userId}`;
        const [result] = yield db_1.default.query(getPageQuery);
        const sql = `SELECT id, title, overview as description, currency_code, images, price, status FROM services WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT ${page_size} OFFSET ${offset}`;
        const [rows] = yield db_1.default.query(sql);
        let totalPages = result.length / page_size;
        let totalPage = Math.ceil(totalPages);
        const getFeatureStatus = `SELECT status FROM users_features WHERE user_id = ${userId} AND feature_id = 5`;
        const [featureStatus] = yield db_1.default.query(getFeatureStatus);
        if (rows.length > 0) {
            // return apiResponse.successResponse(res, "Data Retrieved Successflly", rows);
            return res.status(200).json({
                status: true,
                data: rows,
                featureStatus: featureStatus[0].status,
                userPhone,
                totalPage: totalPage,
                currentPage: page,
                totalLength: result.length,
                message: "Data Retrieved Successflly"
            });
        }
        else {
            // return apiResponse.successResponse(res, "No Data Found", null);
            return res.status(200).json({
                status: true,
                data: null,
                featureStatus: featureStatus[0].status,
                userPhone,
                totalPage: totalPage,
                currentPage: page,
                totalLength: result.length,
                message: "No Data Found"
            });
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.getProducts = getProducts;
// ====================================================================================================
// ====================================================================================================
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId;
        const type = req.query.type; //type = business, user, null
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.query.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "User Id is required!");
        }
        const productId = req.query.productId;
        const { title, description, price, image, currencyCode } = req.body;
        const sql = `UPDATE services SET title = ?, overview = ?, price = ?, currency_code = ?, images = ? WHERE user_id = ? AND id = ?`;
        const VALUES = [title, description, price, currencyCode, image, userId, productId];
        const [rows] = yield db_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Product Updated Successfully", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to Update Product, try again");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
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
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.query.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "User Id is required!");
        }
        const productId = req.query.productId;
        const sql = `DELETE FROM services WHERE user_id = ? AND id = ?`;
        const VALUES = [userId, productId];
        const [rows] = yield db_1.default.query(sql, VALUES);
        return apiResponse.successResponse(res, "Product Deleted Successfully", null);
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.deleteProduct = deleteProduct;
// ====================================================================================================
// ====================================================================================================
