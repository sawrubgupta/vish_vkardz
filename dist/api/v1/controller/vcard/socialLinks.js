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
exports.deleteSocialLink = exports.updateSocialLinks = exports.getSocialLinks = void 0;
const apiResponse = __importStar(require("../../helper/apiResponse"));
const db_1 = __importDefault(require("../../../../db"));
const utility = __importStar(require("../../helper/utility"));
const development_1 = __importDefault(require("../../config/development"));
const getSocialLinks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId: string = res.locals.jwt.userId;
        let userId;
        const type = req.query.type; //type = business, user, null
        if (type && type === development_1.default.businessType) {
            userId = req.query.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !");
        }
        let keyword = req.query.keyword;
        // var getPage:any = req.query.page;
        // var page = parseInt(getPage);
        // if (page === null || page <= 1 || !page ) {
        //     page = 1;
        // }
        // var page_size: any = config.pageSize;       
        // const offset = (page - 1 ) * page_size;
        // const getPageQuery = `SELECT social_sites.id, vcard_social_sites.value FROM social_sites LEFT JOIN vcard_social_sites ON social_sites.id = vcard_social_sites.site_id WHERE vcard_social_sites.user_id = ${userId} AND social_sites.name LIKE '%${keyword}%'`;
        // const [result]:any= await pool.query(getPageQuery);
        const sql = `SELECT social_sites.id, social_sites.name, social_sites.social_link, social_sites.social_img, social_sites.type, social_sites.status, social_sites.primary_profile, social_sites.icon, social_sites.mobile_icon, vcard_social_sites.value, vcard_social_sites.label, vcard_social_sites.orders FROM social_sites LEFT JOIN vcard_social_sites ON social_sites.id = vcard_social_sites.site_id AND vcard_social_sites.user_id = ${userId} AND social_sites.name LIKE '%${keyword}%' ORDER BY vcard_social_sites.value DESC, vcard_social_sites.orders IS NULL ASC`;
        //  limit ${page_size} offset ${offset}`;
        const [socialRows] = yield db_1.default.query(sql);
        // let totalPages:any = result.length/page_size;
        // let totalPage = Math.ceil(totalPages);
        return apiResponse.successResponse(res, "List of all social links.", socialRows);
        // return res.status(200).json({
        //     status: true,
        //     data: socialRows,
        //     totalPage: totalPage,
        //     currentPage: page,
        //     totalLength: result.length,
        //     message: "List of all social links."
        // })
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.getSocialLinks = getSocialLinks;
// ====================================================================================================
// ====================================================================================================
const updateSocialLinks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId;
        const type = req.query.type; //type = business, user, null
        if (type && type === development_1.default.businessType) {
            userId = req.query.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !");
        }
        const createdAt = utility.dateWithFormat();
        const { siteId, siteValue, orders, siteLabel } = req.body;
        let data;
        const sql = `SELECT id From vcard_social_sites WHERE user_id = ${userId} AND site_id = ${siteId}`;
        const [socialRows] = yield db_1.default.query(sql);
        if (socialRows.length > 0) {
            const updateQuery = `UPDATE vcard_social_sites SET orders = ?, label = ?, value = ? WHERE user_id = ? AND site_id = ?`;
            const VALUES = [orders, siteLabel, siteValue, userId, siteId];
            [data] = yield db_1.default.query(updateQuery, VALUES);
        }
        else {
            const insertQuery = `INSERT INTO vcard_social_sites (user_id, site_id, orders, label, value, created_at) VALUES(?, ?, ?, ?, ?, ?)`;
            const VALUES = [userId, siteId, orders, siteLabel, siteValue, createdAt];
            [data] = yield db_1.default.query(insertQuery, VALUES);
        }
        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Social links updated successfully", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to update social link, try again later!");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.updateSocialLinks = updateSocialLinks;
// ====================================================================================================
// ====================================================================================================
const deleteSocialLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId;
        const type = req.query.type; //type = business, user, null
        if (type && type === development_1.default.businessType) {
            userId = req.query.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !");
        }
        const siteId = req.query.siteId;
        const sql = `DELETE FROM vcard_social_sites WHERE user_id = ? AND site_id = ?`;
        const VALUES = [userId, siteId];
        const [data] = yield db_1.default.query(sql, VALUES);
        return apiResponse.successResponse(res, "Social link deleted successfully", null);
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Soething went wrong");
    }
});
exports.deleteSocialLink = deleteSocialLink;
// ====================================================================================================
// ====================================================================================================
