import {Request, Response} from "express";
import * as apiRespone from '../../helper/apiResponse';
import pool from '../../../../db';

export const getVcardProfile =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        if (!userId || userId === "" || userId === undefined) {
            return apiRespone.errorMessage(res, 404, "User profile not found !");
        }

        const sql = `SELECT id, username, card_number, full_name, thumb, cover_photo, vcard_layouts,  vcard_bg_color, designation, company_name, display_email, display_dial_code, display_number, website, display_email, address, colors FROM users WHERE id = ${userId} LIMIT 1`;
        const [userData]:any = await pool.query(sql);

        if (userData.length > 0) {
            const getSocialSiteQyery = `SELECT social_sites.id, social_sites.name, social_sites.social_link, social_sites.social_img, social_sites.type, social_sites.status, social_sites.primary_profile, vcard_social_sites.value, vcard_social_sites.orders FROM social_sites INNER JOIN vcard_social_sites on social_sites.id = vcard_social_sites.site_id AND vcard_social_sites.user_id = ${userId} ORDER BY vcard_social_sites.orders IS NULL ASC`;
            const [socialRows]:any = await pool.query(getSocialSiteQyery);

            if(socialRows.length > 0) {
                userData[0].socialSites = socialRows;
                return apiRespone.successResponse(res, "Get user vcard profile data !", userData[0]);
            } else {
                userData[0].socialSites= null;
                return apiRespone.successResponse(res, "Get user vcard profile data !", userData[0]);
            }
        }
    } catch (error) {
        console.log(error);
        return apiRespone.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
