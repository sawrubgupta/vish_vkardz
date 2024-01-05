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
exports.features = exports.updateUserFeaturesStatus = exports.getFeatureByUserId = void 0;
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const development_1 = __importDefault(require("../../config/development"));
const responseMsg_1 = __importDefault(require("../../config/responseMsg"));
const manageFeatureResMsg = responseMsg_1.default.features.manageFeature;
const getFeatureByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
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
            return apiResponse.errorMessage(res, 401, manageFeatureResMsg.getFeatureByUserId.nullUserId);
        if (!profileId || profileId === null)
            return apiResponse.errorMessage(res, 400, manageFeatureResMsg.getFeatureByUserId.nullProfileId);
        const checkPackageSql = `SELECT * FROM users_package WHERE user_id = ${userId} LIMIT 1`;
        const [packageRows] = yield dbV2_1.default.query(checkPackageSql);
        let package_name = (_b = (_a = packageRows[0]) === null || _a === void 0 ? void 0 : _a.package_slug) !== null && _b !== void 0 ? _b : null;
        let sql = "";
        if (package_name == null) {
            sql = `SELECT users_features.feature_id, features.type, features.icon, features.features, features.slug, users_features.status FROM features LEFT JOIN users_features ON features.id = users_features.feature_id WHERE users_features.user_id = ${userId} AND users_features.profile_id = ${profileId} AND features.status = 1 AND is_business_feature = 0`;
        }
        else {
            sql = `SELECT users_features.feature_id, features.type, features.icon, features.features, features.slug, users_features.status FROM features LEFT JOIN users_features ON features.id = users_features.feature_id WHERE users_features.user_id = ${userId} AND users_features.profile_id = ${profileId} AND features.status = 1`;
        }
        // const sql = `SELECT users_features.feature_id, features.features, features.slug, users_features.status FROM features LEFT JOIN users_features ON features.id = users_features.feature_id WHERE users_features.user_id = ${userId} AND features.id IN (3, 5, 6, 8, 10, 11)`;
        const [rows] = yield dbV2_1.default.query(sql);
        const avgFeatureSql = `SELECT users_features.feature_id, features.features, features.slug, users_features.status FROM features LEFT JOIN users_features ON features.id = users_features.feature_id WHERE users_features.user_id = ${userId} AND users_features.profile_id = ${profileId} AND features.status = 1 AND features.id IN (3, 5, 6, 8, 10, 11)`;
        const [avgRows] = yield dbV2_1.default.query(avgFeatureSql);
        const avgActiveFeature = (avgRows.length / 6) * 100;
        // return apiResponse.successResponse(res, "User Features Get Successfully", rows);
        return res.status(200).json({
            status: true,
            data: rows, avgActiveFeature,
            message: manageFeatureResMsg.getFeatureByUserId.successMsg
        });
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.getFeatureByUserId = getFeatureByUserId;
// ====================================================================================================
// ====================================================================================================
const updateUserFeaturesStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            return apiResponse.errorMessage(res, 401, manageFeatureResMsg.updateUserFeaturesStatus.nullUserId);
        if (!profileId || profileId === null)
            return apiResponse.errorMessage(res, 400, manageFeatureResMsg.updateUserFeaturesStatus.nullProfileId);
        let data;
        const sql = `UPDATE users_features SET status = ? WHERE user_id = ? AND feature_id = ? AND profile_id = ?`;
        for (const element of req.body.features) {
            const featureId = element.featureId;
            const status = element.status;
            let VALUES = [status, userId, featureId, profileId];
            [data] = yield dbV2_1.default.query(sql, VALUES);
        }
        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, manageFeatureResMsg.updateUserFeaturesStatus.successMsg, null);
        }
        else {
            return apiResponse.errorMessage(res, 400, manageFeatureResMsg.updateUserFeaturesStatus.failedMsg);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.updateUserFeaturesStatus = updateUserFeaturesStatus;
// ====================================================================================================
// ====================================================================================================
// get business features (profile setting)
const features = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
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
            return apiResponse.errorMessage(res, 401, manageFeatureResMsg.getFeatureByUserId.nullUserId);
        const checkPackageSql = `SELECT * FROM users_package WHERE user_id = ${userId} LIMIT 1`;
        const [packageRows] = yield dbV2_1.default.query(checkPackageSql);
        let package_name = (_d = (_c = packageRows[0]) === null || _c === void 0 ? void 0 : _c.package_slug) !== null && _d !== void 0 ? _d : null;
        let sql = "";
        if (package_name == null) {
            sql = `SELECT * FROM features WHERE feature_show = 1 AND is_business_feature = 0 ORDER BY sequence_id ASC`;
        }
        else {
            sql = `SELECT * FROM features WHERE feature_show = 1 ORDER BY sequence_id ASC`;
        }
        const [rows] = yield dbV2_1.default.query(sql);
        return res.status(200).json({
            status: true,
            data: rows,
            message: manageFeatureResMsg.features.successMsg
        });
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.features = features;
// ====================================================================================================
// ====================================================================================================
