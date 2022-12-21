import { Request, Response, NextFunction } from "express";
import * as apiRespone from '../../helper/apiResponse';
import pool from '../../../../db';

export const getSocialLinks =async (req:Request, res:Response) => {
    try {
        const userId: string = res.locals.jwt.userId;

        const sql = `SELECT social_sites.id, social_sites.name, social_sites.social_link, social_sites.social_img, social_sites.type, social_sites.status, social_sites.primary_profile, social_sites.icon, social_sites.mobile_icon, vcard_social_sites.value, vcard_social_sites.label, vcard_social_sites.orders FROM social_sites LEFT JOIN vcard_social_sites ON social_sites.id = vcard_social_sites.site_id AND vcard_social_sites.user_id = ${userId} ORDER BY  vcard_social_sites.orders IS NULL ASC`;
        const [socialRows]:any = await pool.query(sql); 
        
        return apiRespone.successResponse(res, "List of all social links.", socialRows);
    } catch (error) {
        console.log(error);
        return apiRespone.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
