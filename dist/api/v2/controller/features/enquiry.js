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
exports.submitEnquiry = exports.replyEnquiry = exports.deleteEnquiry = exports.enquiryList = void 0;
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const development_1 = __importDefault(require("../../config/development"));
const responseMsg_1 = __importDefault(require("../../config/responseMsg"));
const enquiryResMsg = responseMsg_1.default.features.enquiry;
const enquiryList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId;
        const type = req.query.type; //type = business, user, 
        const profileId = req.query.profileId;
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.query.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, enquiryResMsg.enquiryList.nullUserId);
        var getPage = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page) {
            page = 1;
        }
        var page_size = development_1.default.pageSize;
        const offset = (page - 1) * page_size;
        const getPageQuery = `SELECT id, name, email, phone_num, msg, created_at FROM user_contacts WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [result] = yield dbV2_1.default.query(getPageQuery);
        const sql = `SELECT id, name, email, phone_num, msg, created_at FROM user_contacts WHERE user_id = ${userId} AND profile_id = ${profileId} ORDER BY id DESC LIMIT ${page_size} OFFSET ${offset}`;
        const [rows] = yield dbV2_1.default.query(sql);
        const getFeatureStatus = `SELECT status FROM users_features WHERE user_id = ${userId} AND profile_id = ${profileId} AND feature_id = 11`;
        let [featureStatus] = yield dbV2_1.default.query(getFeatureStatus);
        if (featureStatus.length === 0) {
            featureStatus[0] = {};
            featureStatus[0].status = 0;
        }
        let totalPages = result.length / page_size;
        let totalPage = Math.ceil(totalPages);
        if (rows.length > 0) {
            return res.status(200).json({
                status: true,
                data: rows,
                featureStatus: featureStatus[0].status || "",
                totalPage: totalPage,
                currentPage: page,
                totalLength: result.length,
                message: enquiryResMsg.enquiryList.successMsg
            });
        }
        else {
            return res.status(200).json({
                status: true,
                data: null,
                featureStatus: featureStatus[0].status,
                totalPage: totalPage,
                currentPage: page,
                totalLength: result.length,
                message: enquiryResMsg.enquiryList.noDataFoundMsg
            });
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.enquiryList = enquiryList;
// ====================================================================================================
// ====================================================================================================
const deleteEnquiry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId;
        const type = req.body.type; //type = business, user, null
        // const profileId = req.body.profileId;
        if (type && type == development_1.default.businessType) {
            userId = req.query.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, enquiryResMsg.deleteEnquiry.nullUserId);
        const enquiryId = req.body.enquiryId;
        // const checkEnquirySql = `SELECT id FROM user_contacts WHERE id = ${enquiryId} AND user_id = ${userId} AND profile_id = ${profileId}`;
        // const [enquryRows]:any = await pool.query(checkEnquirySql);
        // if (enquryRows.length === 0) return apiResponse.errorMessage(res, 400, "Invalid Enqury!");
        const sql = `DELETE FROM user_contacts WHERE user_id = ? AND id = ?`;
        const VALUES = [userId, enquiryId];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, enquiryResMsg.deleteEnquiry.successMsg, null);
        }
        else {
            return apiResponse.errorMessage(res, 400, enquiryResMsg.deleteEnquiry.failedMsg);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.deleteEnquiry = deleteEnquiry;
// ====================================================================================================
// ====================================================================================================
const replyEnquiry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            return apiResponse.errorMessage(res, 401, enquiryResMsg.replyEnquiry.nullUserId);
        const enquiryId = req.body.enquiryId;
        const message = req.body.message;
        const sql = `SELECT email FROM user_contacts WHERE user_id = ? AND id = ? LIMIT 1`;
        const VALUES = [userId, enquiryId];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        if (rows.length > 0) {
            const email = rows[0].email;
            yield utility.sendMail(email, "testing subject", message);
            return apiResponse.successResponse(res, enquiryResMsg.replyEnquiry.successMsg, null);
        }
        else {
            return apiResponse.errorMessage(res, 400, enquiryResMsg.replyEnquiry.failedMsg);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.replyEnquiry = replyEnquiry;
// ====================================================================================================
// ====================================================================================================
const submitEnquiry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { profileId, username, name, email, phone, message } = req.body;
        const createdAt = utility.dateWithFormat();
        const userSql = `SELECT id FROM users WHERE username = '${username}' LIMIT 1`;
        const [userRows] = yield dbV2_1.default.query(userSql);
        if (userRows.length === 0)
            return apiResponse.errorMessage(res, 400, enquiryResMsg.submitEnquiry.invalidUsername);
        const userId = userRows[0].id;
        const sql = `INSERT INTO user_contacts(user_id, profile_id, name, email, phone_num, msg, created_at) VALUES(?, ?, ?, ?, ?, ?, ?)`;
        const VALUES = [userId, profileId, name, email, phone, message, createdAt];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, enquiryResMsg.submitEnquiry.successMsg, null);
        }
        else {
            return apiResponse.errorMessage(res, 400, enquiryResMsg.submitEnquiry.failedMsg);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.submitEnquiry = submitEnquiry;
// ====================================================================================================
// ====================================================================================================
