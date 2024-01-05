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
exports.deleteAboutUs = exports.getAboutUs = exports.addUpdateAboutUs = void 0;
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const development_1 = __importDefault(require("../../config/development"));
const responseMsg_1 = __importDefault(require("../../config/responseMsg"));
const featuresResMsg = responseMsg_1.default.features.aboutUs;
const addUpdateAboutUs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            return apiResponse.errorMessage(res, 401, featuresResMsg.addUpdateAboutUs.nullUserId);
        const createdAt = utility.dateWithFormat();
        const { companyName, year, business, aboutUsDetail, image, coverImage, profileId, document } = req.body;
        const checkProfile = `SELECT id FROM users_profile WHERE user_id = ${userId} AND id = ${profileId} LIMIT 1`;
        const [profileRows] = yield dbV2_1.default.query(checkProfile);
        if (profileRows.length === 0)
            return apiResponse.errorMessage(res, 400, featuresResMsg.addUpdateAboutUs.profileNotExist);
        const getAboutUs = `SELECT id FROM about WHERE user_id = ${userId} AND profile_id = ${profileId} LIMIT 1`;
        const [aboutUsRows] = yield dbV2_1.default.query(getAboutUs);
        if (aboutUsRows.length > 0) {
            const updateQuery = `UPDATE about SET company_name = ?, year = ?, business = ?, about_detail = ?, images = ?, cover_image = ?, document = ? WHERE user_id = ? AND profile_id = ?`;
            const VALUES = [companyName, year, business, aboutUsDetail, image, coverImage, document, userId, profileId];
            const [updatedRows] = yield dbV2_1.default.query(updateQuery, VALUES);
            if (updatedRows.affectedRows > 0) {
                return apiResponse.successResponse(res, featuresResMsg.addUpdateAboutUs.successUpdateMsg, null);
            }
            else {
                return apiResponse.errorMessage(res, 400, featuresResMsg.addUpdateAboutUs.failedMsg);
            }
        }
        else {
            const insertedQuery = `INSERT INTO about(user_id, profile_id, company_name, business, year, about_detail, images, cover_image, document, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const insertVALUES = [userId, profileId, companyName, business, year, aboutUsDetail, image, coverImage, document, createdAt];
            const [insertedRows] = yield dbV2_1.default.query(insertedQuery, insertVALUES);
            if (insertedRows.affectedRows > 0) {
                return apiResponse.successResponse(res, featuresResMsg.addUpdateAboutUs.successInsertMsg, null);
            }
            else {
                return apiResponse.errorMessage(res, 400, featuresResMsg.addUpdateAboutUs.failedMsg);
            }
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.addUpdateAboutUs = addUpdateAboutUs;
// ====================================================================================================
// ====================================================================================================
const getAboutUs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            return apiResponse.errorMessage(res, 401, featuresResMsg.getAboutUs.nullUserId);
        const sql = `SELECT id, company_name, business, year, about_detail, images, cover_image, created_at, document FROM about WHERE user_id = ${userId} AND profile_id = ${profileId} LIMIT 1`;
        const [rows] = yield dbV2_1.default.query(sql);
        const getFeatureStatus = `SELECT status FROM users_features WHERE user_id = ${userId} AND profile_id = ${profileId} AND feature_id = 3 LIMIT 1`;
        const [featureStatusRRows] = yield dbV2_1.default.query(getFeatureStatus);
        let featureStatus = featureStatusRRows[0].status;
        if (rows.length > 0) {
            rows[0].featureStatus = featureStatus;
            return apiResponse.successResponse(res, featuresResMsg.getAboutUs.successMsg, rows[0]);
        }
        else {
            // return apiResponse.successResponse(res, "No Data Found", null)
            return res.status(200).json({
                status: true,
                data: null, featureStatus,
                message: featuresResMsg.getAboutUs.noDataFoundMsg
            });
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.getAboutUs = getAboutUs;
// ====================================================================================================
// ====================================================================================================
const deleteAboutUs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            return apiResponse.errorMessage(res, 401, featuresResMsg.deleteAboutUs.nullUserId);
        const sql = `DELETE FROM about WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [rows] = yield dbV2_1.default.query(sql);
        return apiResponse.successResponse(res, featuresResMsg.deleteAboutUs.successMsg, null);
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.deleteAboutUs = deleteAboutUs;
// ====================================================================================================
// ====================================================================================================
