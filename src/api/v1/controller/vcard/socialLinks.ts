import { Request, Response, NextFunction } from "express";
import * as apiResponse from '../../helper/apiResponse';
import pool from '../../../../db';
import * as utility from "../../helper/utility";

export const getSocialLinks =async (req:Request, res:Response) => {
    try {
        const userId: string = res.locals.jwt.userId;

        const sql = `SELECT social_sites.id, social_sites.name, social_sites.social_link, social_sites.social_img, social_sites.type, social_sites.status, social_sites.primary_profile, social_sites.icon, social_sites.mobile_icon, vcard_social_sites.value, vcard_social_sites.label, vcard_social_sites.orders FROM social_sites LEFT JOIN vcard_social_sites ON social_sites.id = vcard_social_sites.site_id AND vcard_social_sites.user_id = ${userId} ORDER BY  vcard_social_sites.orders IS NULL ASC`;
        const [socialRows]:any = await pool.query(sql); 
        
        return apiResponse.successResponse(res, "List of all social links.", socialRows);
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const updateSocialLinks = async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        const createdAt = utility.dateWithFormat();

        let data:any
        let updateQuery = `UPDATE vcard_social_sites SET orders = ?, label = ?, value = ? WHERE user_id = ? AND site_id = ?`;
        let insertQuery = `INSERT INTO vcard_social_sites (user_id, site_id, orders, label, value, created_at) VALUES(?, ?, ?, ?, ?, ?)`

        for await (const socialSiteItem of req.body.socialSites) {
            const siteId =  socialSiteItem.siteId;
            const siteValue =  socialSiteItem.siteValue;
            const orders =  socialSiteItem.orders;
            const siteLabel =  socialSiteItem.siteLabel;

            const sql = `SELECT * From vcard_social_sites WHERE user_id = ${userId} AND site_id = ${siteId}`;
            const [socialRows]:any = await pool.query(sql)

            if (socialRows.length > 0) {
                const VALUES = [orders, siteLabel, siteValue, userId, siteId];
                [data] = await pool.query(updateQuery, VALUES);
            } else {
                const VALUES = [userId, siteId, orders, siteLabel, siteValue, createdAt];
                [data] = await pool.query(insertQuery, VALUES);
            }
        }
        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Scial link updated successflly", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to update social link, try again later");
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
        const userId:string = res.locals.jwt.userId;
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
