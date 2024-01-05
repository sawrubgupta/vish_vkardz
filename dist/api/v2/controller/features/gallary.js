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
exports.deleteImage = exports.getPortfolio = exports.gallary = void 0;
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const development_1 = __importDefault(require("../../config/development"));
const responseMsg_1 = __importDefault(require("../../config/responseMsg"));
const galleryResMsg = responseMsg_1.default.features.gallery;
const gallary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
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
            return apiResponse.errorMessage(res, 401, galleryResMsg.gallary.nullUserId);
        const createdAt = utility.dateWithFormat();
        const { profileId, image } = req.body;
        if (!profileId || profileId === null)
            return apiResponse.errorMessage(res, 400, "Profile id is required");
        if (!image || image === "" || image === undefined)
            return apiResponse.errorMessage(res, 400, "Please Upload Image");
        const limitSql = `SELECT * FROM user_limitations WHERE type = '${development_1.default.galleryType}' AND status = 1 LIMIT 1`;
        const [limitRows] = yield dbV2_1.default.query(limitSql);
        const galleryLimit = (_b = (_a = limitRows[0]) === null || _a === void 0 ? void 0 : _a.limitation) !== null && _b !== void 0 ? _b : 50;
        const galleryCountSql = `SELECT COUNT(id) AS totalGallery FROM portfolio WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [galleryCountRows] = yield dbV2_1.default.query(galleryCountSql);
        if (galleryCountRows[0].totalGallery >= galleryLimit)
            return apiResponse.errorMessage(res, 400, `Profile limit reached. You can only have a maximum of ${galleryLimit} Images.`);
        const sql = `INSERT INTO portfolio(user_id, profile_id, image, thumb, status, created_at) VALUES(?, ?, ?, ?, ?, ?)`;
        const VALUES = [userId, profileId, image, image, 1, createdAt];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, galleryResMsg.gallary.successMsg, null);
        }
        else {
            return apiResponse.errorMessage(res, 400, galleryResMsg.gallary.failedMsg);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.gallary = gallary;
// ====================================================================================================
// ====================================================================================================
const getPortfolio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
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
            return apiResponse.errorMessage(res, 401, galleryResMsg.getPortfolio.nullUserId);
        var getPage = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page) {
            page = 1;
        }
        var page_size = development_1.default.pageSize;
        const offset = (page - 1) * page_size;
        const getPageQuery = `SELECT id, image FROM portfolio WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [result] = yield dbV2_1.default.query(getPageQuery);
        const sql = `SELECT id, image FROM portfolio WHERE user_id = ${userId} AND profile_id = ${profileId} ORDER BY created_at DESC LIMIT ${page_size} OFFSET ${offset}`;
        const [rows] = yield dbV2_1.default.query(sql);
        const getFeatureStatus = `SELECT status FROM users_features WHERE user_id = ${userId} AND profile_id = ${profileId} AND feature_id = 8`;
        console.log("getFeatureStatus", getFeatureStatus);
        const [featureRows] = yield dbV2_1.default.query(getFeatureStatus);
        let featureStatus = (_d = (_c = featureRows[0]) === null || _c === void 0 ? void 0 : _c.status) !== null && _d !== void 0 ? _d : 0;
        // if (featureRows.length > 0) {
        // featureStatus = featureRows[0]?.status ?? 0;
        // } else {
        //     featureStatus = 0;
        // }
        let totalPages = result.length / page_size;
        let totalPage = Math.ceil(totalPages);
        if (rows.length > 0) {
            return res.status(200).json({
                status: true,
                data: rows,
                featureStatus: featureStatus,
                totalPage: totalPage,
                currentPage: page,
                totalLength: result.length,
                message: galleryResMsg.getPortfolio.successMsg
            });
        }
        else {
            return res.status(200).json({
                status: true,
                data: null,
                featureStatus: featureStatus,
                totalPage: totalPage,
                currentPage: page,
                totalLength: result.length,
                message: galleryResMsg.getPortfolio.noDataFoundMsg
            });
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.getPortfolio = getPortfolio;
// ====================================================================================================
// ====================================================================================================
const deleteImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            return apiResponse.errorMessage(res, 401, galleryResMsg.deleteImage.nullUserId);
        const portfolioId = req.body.portfolioId;
        const sql = `DELETE FROM portfolio WHERE user_id = ${userId} AND id IN (${portfolioId})`;
        const [rows] = yield dbV2_1.default.query(sql);
        return apiResponse.successResponse(res, galleryResMsg.deleteImage.successMsg, null);
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.deleteImage = deleteImage;
// ====================================================================================================
// ====================================================================================================
