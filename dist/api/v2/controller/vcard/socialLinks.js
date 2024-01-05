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
exports.socialStatus = exports.deleteSocialLink = exports.addUpdateSocialLinks = exports.updateSocialLinks = exports.addSocialLinks = exports.getSocialLinks = void 0;
const apiResponse = __importStar(require("../../helper/apiResponse"));
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const utility = __importStar(require("../../helper/utility"));
const development_1 = __importDefault(require("../../config/development"));
const getSocialLinks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId: string = res.locals.jwt.userId;
        let userId;
        const type = req.query.type; //type = business, user, null
        const profileId = req.query.profileId;
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.query.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        // if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, "Please login !");
        // if (!profileId || profileId === null) return apiResponse.errorMessage(res, 400, "Profile id is required");
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
        const sql = `SELECT social_sites.id, vcard_social_sites.id AS userSocialId, social_sites.name, social_sites.social_link, social_sites.social_img, social_sites.type, social_sites.social_type, social_sites.placeholder_text, social_sites.title, social_sites.description, vcard_social_sites.status, social_sites.primary_profile, social_sites.icon, social_sites.mobile_icon, vcard_social_sites.value, vcard_social_sites.label, vcard_social_sites.orders FROM social_sites LEFT JOIN vcard_social_sites ON social_sites.id = vcard_social_sites.site_id AND vcard_social_sites.user_id = ${userId} AND vcard_social_sites.profile_id = ${profileId} WHERE (social_sites.name LIKE '%${keyword}%' OR social_sites.social_type LIKE '%${keyword}%') ORDER BY social_sites.name, vcard_social_sites.value DESC, vcard_social_sites.orders IS NULL ASC`;
        // copy from profile list // const getSocialSiteQuery = `SELECT social_sites.id, vcard_social_sites.id AS userSocialId, social_sites.name, social_sites.social_link, social_sites.social_img, social_sites.type, vcard_social_sites.status, social_sites.primary_profile, vcard_social_sites.value, vcard_social_sites.label, vcard_social_sites.orders FROM social_sites LEFT JOIN vcard_social_sites ON social_sites.id = vcard_social_sites.site_id AND vcard_social_sites.user_id = ${userId} AND vcard_social_sites.profile_id = ${profileId} HAVING vcard_social_sites.value IS NOT NULL ORDER BY vcard_social_sites.value DESC, vcard_social_sites.orders IS NULL ASC`;
        // const sql = `SELECT social_sites.id, social_sites.name, social_sites.social_link, social_sites.social_img, social_sites.type, social_sites.social_type, social_sites.placeholder_text, social_sites.title, social_sites.description, social_sites.primary_profile, social_sites.icon, social_sites.mobile_icon FROM social_sites WHERE (social_sites.name LIKE '%${keyword}%' OR social_sites.social_type LIKE '%${keyword}%') ORDER BY social_sites.name`
        const [socialRows] = yield dbV2_1.default.query(sql);
        let contactData = [];
        let socialData = [];
        let businessData = [];
        let paymentData = [];
        let moreData = [];
        for (const ele of socialRows) {
            if (ele.social_type === development_1.default.contactType) {
                contactData.push(ele);
            }
            else if (ele.social_type === development_1.default.socialType) {
                socialData.push(ele);
            }
            else if (ele.social_type === development_1.default.businessType) {
                businessData.push(ele);
            }
            else if (ele.social_type === development_1.default.paymentType) {
                paymentData.push(ele);
            }
            else {
                moreData.push(ele);
            }
        }
        // let totalPages:any = result.length/page_size;
        // let totalPage = Math.ceil(totalPages);
        const data = [
            { categoryName: development_1.default.contactType, socialData: contactData },
            { categoryName: development_1.default.socialType, socialData: socialData },
            { categoryName: development_1.default.businessType, socialData: businessData },
            { categoryName: development_1.default.paymentType, socialData: paymentData },
            { categoryName: 'more', socialData: moreData }
        ];
        return apiResponse.successResponse(res, "List of all social links.", data);
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.getSocialLinks = getSocialLinks;
// ====================================================================================================
// ====================================================================================================
const addSocialLinks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !");
        }
        const createdAt = utility.dateWithFormat();
        const { siteId, siteValue, orders, siteLabel } = req.body;
        // const sql = `SELECT id From vcard_social_sites WHERE user_id = ${userId} AND site_id = ${siteId} AND profile_id = ${profileId} LIMIT 1`;
        // const [socialRows]:any = await pool.query(sql)
        // if (socialRows.length > 0) {
        //     const updateQuery = `UPDATE vcard_social_sites SET orders = ?, label = ?, value = ? WHERE user_id = ? AND site_id = ?`;
        //     const VALUES = [orders, siteLabel, siteValue, userId, siteId];
        //     [data] = await pool.query(updateQuery, VALUES);
        // } else {
        const insertQuery = `INSERT INTO vcard_social_sites (user_id, profile_id, site_id, orders, label, value, created_at) VALUES(?, ?, ?, ?, ?, ?, ?)`;
        const VALUES = [userId, profileId, siteId, orders, siteLabel, siteValue, createdAt];
        const [data] = yield dbV2_1.default.query(insertQuery, VALUES);
        // }
        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Social links added successfully", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to add social link, try again later!");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.addSocialLinks = addSocialLinks;
// ====================================================================================================
// ====================================================================================================
const updateSocialLinks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !");
        }
        const createdAt = utility.dateWithFormat();
        const { userSocialId, siteId, siteValue, orders, siteLabel } = req.body;
        // const sql = `SELECT id From vcard_social_sites WHERE user_id = ${userId} AND site_id = ${siteId} AND profile_id = ${profileId} LIMIT 1`;
        // const [socialRows]: any = await pool.query(sql)
        // if (socialRows.length > 0) {
        const updateQuery = `UPDATE vcard_social_sites SET orders = ?, label = ?, value = ? WHERE user_id = ? AND site_id = ? AND id = ?`;
        const VALUES = [orders, siteLabel, siteValue, userId, siteId, userSocialId];
        const [data] = yield dbV2_1.default.query(updateQuery, VALUES);
        // } else {
        // const insertQuery = `INSERT INTO vcard_social_sites (user_id, profile_id, site_id, orders, label, value, created_at) VALUES(?, ?, ?, ?, ?, ?, ?)`
        // const VALUES = [userId, profileId, siteId, orders, siteLabel, siteValue, createdAt];
        // const [data]:any = await pool.query(insertQuery, VALUES);
        // }
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
const addUpdateSocialLinks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !");
        }
        const createdAt = utility.dateWithFormat();
        const { siteId, siteValue, orders, siteLabel } = req.body;
        let data;
        const sql = `SELECT id From vcard_social_sites WHERE user_id = ${userId} AND site_id = ${siteId} AND profile_id = ${profileId} LIMIT 1`;
        const [socialRows] = yield dbV2_1.default.query(sql);
        if (socialRows.length > 0) {
            const updateQuery = `UPDATE vcard_social_sites SET orders = ?, label = ?, value = ? WHERE user_id = ? AND site_id = ?`;
            const VALUES = [orders, siteLabel, siteValue, userId, siteId];
            [data] = yield dbV2_1.default.query(updateQuery, VALUES);
        }
        else {
            const insertQuery = `INSERT INTO vcard_social_sites (user_id, profile_id, site_id, orders, label, value, created_at) VALUES(?, ?, ?, ?, ?, ?, ?)`;
            const VALUES = [userId, profileId, siteId, orders, siteLabel, siteValue, createdAt];
            [data] = yield dbV2_1.default.query(insertQuery, VALUES);
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
exports.addUpdateSocialLinks = addUpdateSocialLinks;
// ====================================================================================================
// ====================================================================================================
const deleteSocialLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !");
        }
        const siteId = req.body.siteId;
        const profileId = req.body.profileId;
        const userSocialId = req.body.userSocialId;
        const sql = `DELETE FROM vcard_social_sites WHERE user_id = ? AND site_id = ? AND profile_id = ? AND id = ?`;
        const VALUES = [userId, siteId, profileId, userSocialId];
        const [data] = yield dbV2_1.default.query(sql, VALUES);
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
const socialStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId = res.locals.jwt.userId;
        const userSocialId = req.body.userSocialId;
        const status = req.body.status;
        let userId;
        const type = req.body.type; //type = business, user, null
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.body.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, "Please login !");
        const sql = `UPDATE vcard_social_sites SET status = ? WHERE user_id = ? AND id = ?`;
        const VALUES = [status, userId, userSocialId];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Success", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed, try again");
        }
    }
    catch (e) {
        console.log(e);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.socialStatus = socialStatus;
// ====================================================================================================
// ====================================================================================================
