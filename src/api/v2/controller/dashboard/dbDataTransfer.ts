import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import _ from 'lodash';


export const userToUserProfileDataTransfer =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const currentDate = utility.dateWithFormat();

        if (userId && !userId) return apiResponse.errorMessage(res, 400, "You don't have access!!");
        
        const userQuery = `SELECT * FROM users`;
        const [userRows]:any = await pool.query(userQuery);
  
        // const userProfileSql = `INSERT INTO users_profile(user_id, profile_image, cover_photo, hit, share_link, qr_code, language, vcard_layouts, vcard_bg_color, font, is_private, is_private, set_password, on_tap_url, is_default, created_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        let userProfileSql = `INSERT INTO users_profile(user_id, profile_image, cover_photo, hit, share_link, qr_code, language, vcard_layouts, vcard_bg_color, set_password, on_tap_url, is_default, created_at) VALUES `;
        let result:any;

        for await (const userEle of userRows) {
            const userId = userEle.id;
            const thumb = userEle.thumb;
            const cover_photo = userEle.cover_photo;
            const hit = userEle.hit;
            const share_link = userEle.share_link;
            const qr_code = userEle.qr_code;
            const vcard_layouts = userEle.vcard_layouts;
            const vcard_bg_color = userEle.vcard_bg_color;
            const set_password = userEle.set_password;
            const primary_profile_link = userEle.primary_profile_link;

            userProfileSql = userProfileSql + ` (${userId}, '${thumb}', '${cover_photo}', ${hit}, ${share_link}, '${qr_code}', 'eng', ${vcard_layouts}, '${vcard_bg_color}', '${set_password}', '${primary_profile_link}', 1, '${currentDate}'), `;
            result = userProfileSql.substring(0,userProfileSql.lastIndexOf(','));

        }
        console.log(result);
        
        const [rows]:any = await pool.query(result)
        if (rows.affectedRows > 0) {
            return await apiResponse.successResponse(res, "Transfer successfully", null);
        } else {
            return await apiResponse.errorMessage(res, 400, "Failed!!");
        }
 
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

// UPDATE vcf_custom_field
// JOIN users_profile ON vcf_custom_field.user_id = users_profile.user_id
// SET vcf_custom_field.profile_id = users_profile.id;

// export const 

// ====================================================================================================
// ====================================================================================================
