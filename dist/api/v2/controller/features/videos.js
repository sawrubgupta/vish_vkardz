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
exports.deleteVideos = exports.getVideos = exports.addVideos = void 0;
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const development_1 = __importDefault(require("../../config/development"));
const responseMsg_1 = __importDefault(require("../../config/responseMsg"));
const videosResMsg = responseMsg_1.default.features.videos;
const addVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId = res.locals.jwt.userId;
        let userId;
        const type = req.query.type; //type = business, user, null
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.query.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, videosResMsg.addVideos.nullUserId);
        const createdAt = utility.dateWithFormat();
        const { profileId, videoType, url, thumbnail } = req.body;
        const sql = `INSERT INTO videos(user_id, profile_id, type, url, thumbnail, created_at) VALUES(?, ?, ?, ?, ?, ?)`;
        const VALUES = [userId, profileId, videoType, url, thumbnail, createdAt];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, videosResMsg.addVideos.successMsg, null);
        }
        else {
            return apiResponse.errorMessage(res, 400, videosResMsg.addVideos.failedMsg);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.addVideos = addVideos;
// ====================================================================================================
// ====================================================================================================
const getVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId;
        const type = req.query.type; //type = business, user, null
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.query.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, videosResMsg.getVideos.nullUserId);
        const profileId = req.query.profileId;
        var getPage = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page) {
            page = 1;
        }
        var page_size = development_1.default.pageSize;
        const offset = (page - 1) * page_size;
        const pageQuery = `SELECT COUNT(id) AS length FROM videos WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [result] = yield dbV2_1.default.query(pageQuery);
        const sql = `SELECT * FROM videos WHERE user_id = ${userId} AND profile_id = ${profileId} ORDER BY created_at DESC LIMIT ${page_size} OFFSET ${offset}`;
        const [rows] = yield dbV2_1.default.query(sql);
        let totalPages = result[0].length / page_size;
        let totalPage = Math.ceil(totalPages);
        if (rows.length > 0) {
            return res.status(200).json({
                status: true,
                data: rows,
                totalPage: totalPage,
                currentPage: page,
                totalLength: result[0].length,
                message: videosResMsg.getVideos.successMsg
            });
        }
        else {
            return res.status(200).json({
                status: true,
                data: null,
                totalPage: totalPage,
                currentPage: page,
                totalLength: result[0].length,
                message: videosResMsg.getVideos.noDataFoundMsg
            });
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.getVideos = getVideos;
// ====================================================================================================
// ====================================================================================================
const deleteVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const { profileId, videoId } = req.body;
        const sql = `DELETE FROM videos WHERE user_id = ${userId} AND profile_id = ${profileId} AND id = ${videoId}`;
        const [rows] = yield dbV2_1.default.query(sql);
        return apiResponse.successResponse(res, videosResMsg.deleteVideos.successMsg, null);
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.deleteVideos = deleteVideos;
// ====================================================================================================
// ====================================================================================================
