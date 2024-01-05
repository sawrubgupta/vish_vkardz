import { Request, Response, NextFunction } from "express";
import * as apiResponse from '../../helper/apiResponse';
import pool from '../../../../dbV2';
import * as utility from "../../helper/utility";
import config from '../../config/development';

export const getSocialLinks = async (req: Request, res: Response) => {
    try {
        // const userId: string = res.locals.jwt.userId;
        let userId: any;
        const type = req.query.type; //type = business, user, null
        const profileId = req.query.profileId;
        if (type && (type === config.businessType || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.query.userId;
        } else {
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

        const sql = `SELECT social_sites.id, vcard_social_sites.id AS userSocialId, social_sites.name, social_sites.social_link, social_sites.social_img, social_sites.type, social_sites.social_type, social_sites.placeholder_text, social_sites.title, social_sites.description, vcard_social_sites.status, social_sites.primary_profile, social_sites.icon, social_sites.mobile_icon, vcard_social_sites.value, vcard_social_sites.label, vcard_social_sites.orders FROM social_sites LEFT JOIN vcard_social_sites ON social_sites.id = vcard_social_sites.site_id AND vcard_social_sites.user_id = ${userId} AND vcard_social_sites.profile_id = ${profileId} WHERE (social_sites.name LIKE '%${keyword}%' OR social_sites.social_type LIKE '%${keyword}%') ORDER BY social_sites.name, vcard_social_sites.value DESC, vcard_social_sites.orders IS NULL ASC`
        // copy from profile list // const getSocialSiteQuery = `SELECT social_sites.id, vcard_social_sites.id AS userSocialId, social_sites.name, social_sites.social_link, social_sites.social_img, social_sites.type, vcard_social_sites.status, social_sites.primary_profile, vcard_social_sites.value, vcard_social_sites.label, vcard_social_sites.orders FROM social_sites LEFT JOIN vcard_social_sites ON social_sites.id = vcard_social_sites.site_id AND vcard_social_sites.user_id = ${userId} AND vcard_social_sites.profile_id = ${profileId} HAVING vcard_social_sites.value IS NOT NULL ORDER BY vcard_social_sites.value DESC, vcard_social_sites.orders IS NULL ASC`;

        // const sql = `SELECT social_sites.id, social_sites.name, social_sites.social_link, social_sites.social_img, social_sites.type, social_sites.social_type, social_sites.placeholder_text, social_sites.title, social_sites.description, social_sites.primary_profile, social_sites.icon, social_sites.mobile_icon FROM social_sites WHERE (social_sites.name LIKE '%${keyword}%' OR social_sites.social_type LIKE '%${keyword}%') ORDER BY social_sites.name`
        const [socialRows]: any = await pool.query(sql);

        let contactData: any = [];
        let socialData: any = [];
        let businessData: any = [];
        let paymentData: any = [];
        let moreData: any = [];
        for (const ele of socialRows) {
            if (ele.social_type === config.contactType) {
                contactData.push(ele);
            } else if (ele.social_type === config.socialType) {
                socialData.push(ele);
            } else if (ele.social_type === config.businessType) {
                businessData.push(ele);
            } else if (ele.social_type === config.paymentType) {
                paymentData.push(ele);
            } else {
                moreData.push(ele);
            }
        }
        // let totalPages:any = result.length/page_size;
        // let totalPage = Math.ceil(totalPages);


        const data = [
            { categoryName: config.contactType, socialData: contactData },
            { categoryName: config.socialType, socialData: socialData },
            { categoryName: config.businessType, socialData: businessData },
            { categoryName: config.paymentType, socialData: paymentData },
            { categoryName: 'more', socialData: moreData }
        ];

        return apiResponse.successResponse(res, "List of all social links.", data);
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const addSocialLinks = async (req: Request, res: Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId: any;
        const type = req.body.type; //type = business, user, null
        const profileId = req.body.profileId;
        if (type && (type === config.businessType || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !")
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
        const insertQuery = `INSERT INTO vcard_social_sites (user_id, profile_id, site_id, orders, label, value, created_at) VALUES(?, ?, ?, ?, ?, ?, ?)`
        const VALUES = [userId, profileId, siteId, orders, siteLabel, siteValue, createdAt];
        const [data]: any = await pool.query(insertQuery, VALUES);
        // }

        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Social links added successfully", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to add social link, try again later!");
        }

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const updateSocialLinks = async (req: Request, res: Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId: any;
        const type = req.body.type; //type = business, user, null
        const profileId = req.body.profileId;
        if (type && (type === config.businessType || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !")
        }

        const createdAt = utility.dateWithFormat();
        const { userSocialId, siteId, siteValue, orders, siteLabel } = req.body;

        // const sql = `SELECT id From vcard_social_sites WHERE user_id = ${userId} AND site_id = ${siteId} AND profile_id = ${profileId} LIMIT 1`;
        // const [socialRows]: any = await pool.query(sql)

        // if (socialRows.length > 0) {
        const updateQuery = `UPDATE vcard_social_sites SET orders = ?, label = ?, value = ? WHERE user_id = ? AND site_id = ? AND id = ?`;
        const VALUES = [orders, siteLabel, siteValue, userId, siteId, userSocialId];
        const [data]:any = await pool.query(updateQuery, VALUES);
        // } else {
        // const insertQuery = `INSERT INTO vcard_social_sites (user_id, profile_id, site_id, orders, label, value, created_at) VALUES(?, ?, ?, ?, ?, ?, ?)`
        // const VALUES = [userId, profileId, siteId, orders, siteLabel, siteValue, createdAt];
        // const [data]:any = await pool.query(insertQuery, VALUES);
        // }

        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Social links updated successfully", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to update social link, try again later!");
        }

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const addUpdateSocialLinks = async (req: Request, res: Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId: any;
        const type = req.body.type; //type = business, user, null
        const profileId = req.body.profileId;
        if (type && (type === config.businessType || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !")
        }

        const createdAt = utility.dateWithFormat();
        const { siteId, siteValue, orders, siteLabel } = req.body;
        let data: any

        const sql = `SELECT id From vcard_social_sites WHERE user_id = ${userId} AND site_id = ${siteId} AND profile_id = ${profileId} LIMIT 1`;
        const [socialRows]: any = await pool.query(sql)

        if (socialRows.length > 0) {
            const updateQuery = `UPDATE vcard_social_sites SET orders = ?, label = ?, value = ? WHERE user_id = ? AND site_id = ?`;
            const VALUES = [orders, siteLabel, siteValue, userId, siteId];
            [data] = await pool.query(updateQuery, VALUES);
        } else {
            const insertQuery = `INSERT INTO vcard_social_sites (user_id, profile_id, site_id, orders, label, value, created_at) VALUES(?, ?, ?, ?, ?, ?, ?)`
            const VALUES = [userId, profileId, siteId, orders, siteLabel, siteValue, createdAt];
            [data] = await pool.query(insertQuery, VALUES);
        }

        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Social links updated successfully", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to update social link, try again later!");
        }

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const deleteSocialLink = async (req: Request, res: Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId: any;
        const type = req.body.type; //type = business, user, null
        if (type && (type === config.businessType || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !")
        }

        const siteId = req.body.siteId;
        const profileId = req.body.profileId;
        const userSocialId = req.body.userSocialId;

        const sql = `DELETE FROM vcard_social_sites WHERE user_id = ? AND site_id = ? AND profile_id = ? AND id = ?`;
        const VALUES = [userId, siteId, profileId, userSocialId];
        const [data]: any = await pool.query(sql, VALUES);

        return apiResponse.successResponse(res, "Social link deleted successfully", null);
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Soething went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const socialStatus =async (req:Request, res:Response) => {
    try {
        // const userId = res.locals.jwt.userId;
        const userSocialId = req.body.userSocialId;
        const status = req.body.status;
        let userId: any;
        const type = req.body.type; //type = business, user, null
        if (type && (type === config.businessType || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, "Please login !")

        const sql = `UPDATE vcard_social_sites SET status = ? WHERE user_id = ? AND id = ?`;
        const VALUES = [status, userId, userSocialId];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Success", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed, try again");
        }

    } catch (e) {
        console.log(e);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================