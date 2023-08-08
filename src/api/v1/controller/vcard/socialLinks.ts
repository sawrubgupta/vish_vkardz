import { Request, Response, NextFunction } from "express";
import * as apiResponse from '../../helper/apiResponse';
import pool from '../../../../db';
import * as utility from "../../helper/utility";
import config  from '../../config/development';

export const getSocialLinks =async (req:Request, res:Response) => {
    try {
        // const userId: string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !")
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

        const sql = `SELECT social_sites.id, social_sites.name, social_sites.social_link, social_sites.social_img, social_sites.type, social_sites.placeholder_text, social_sites.status, social_sites.primary_profile, social_sites.icon, social_sites.mobile_icon, vcard_social_sites.value, vcard_social_sites.label, vcard_social_sites.orders FROM social_sites LEFT JOIN vcard_social_sites ON social_sites.id = vcard_social_sites.site_id AND vcard_social_sites.user_id = ${userId} AND social_sites.name LIKE '%${keyword}%' ORDER BY vcard_social_sites.value DESC, vcard_social_sites.orders IS NULL ASC`
        //  limit ${page_size} offset ${offset}`;
        const [socialRows]:any = await pool.query(sql); 
        
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
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const updateSocialLinks = async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !")
        }
    
        const createdAt = utility.dateWithFormat();
        const { siteId, siteValue, orders, siteLabel } = req.body;
        let data:any

        const sql = `SELECT id From vcard_social_sites WHERE user_id = ${userId} AND site_id = ${siteId}`;
        const [socialRows]:any = await pool.query(sql)

        if (socialRows.length > 0) {
            const updateQuery = `UPDATE vcard_social_sites SET orders = ?, label = ?, value = ? WHERE user_id = ? AND site_id = ?`;
            const VALUES = [orders, siteLabel, siteValue, userId, siteId];
            [data] = await pool.query(updateQuery, VALUES);
        } else {
            const insertQuery = `INSERT INTO vcard_social_sites (user_id, site_id, orders, label, value, created_at) VALUES(?, ?, ?, ?, ?, ?)`
            const VALUES = [userId, siteId, orders, siteLabel, siteValue, createdAt];
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

export const deleteSocialLink =async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !")
        }
    
        const siteId = req.query.siteId;

        const sql = `DELETE FROM vcard_social_sites WHERE user_id = ? AND site_id = ?`;
        const VALUES = [userId, siteId];
        const [data]:any = await pool.query(sql, VALUES);

        return apiResponse.successResponse(res, "Social link deleted successfully", null);
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Soething went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
