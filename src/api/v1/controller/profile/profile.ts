import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';


export const getProfile =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !")
        }
          
        const getUserQuery = `SELECT * FROM users WHERE id = ${userId} LIMIT 1`;
        const [userRows]:any = await pool.query(getUserQuery);
        
        if (userRows.length > 0) {
            delete userRows[0].id;
            delete userRows[0].password;

            const getSocialSiteQuery = `SELECT social_sites.id, social_sites.name, social_sites.social_link, social_sites.social_img, social_sites.type, social_sites.status, social_sites.primary_profile, vcard_social_sites.value, vcard_social_sites.label, vcard_social_sites.orders FROM social_sites LEFT JOIN vcard_social_sites ON social_sites.id = vcard_social_sites.site_id AND vcard_social_sites.user_id = ${userId} HAVING vcard_social_sites.value IS NOT NULL ORDER BY vcard_social_sites.value DESC, vcard_social_sites.orders IS NULL ASC LIMIT 6`;
            const [socialRows]:any = await pool.query(getSocialSiteQuery);

            const getCardQuery = `SELECT products.slug, products.product_image, products.image_back, products.image_other FROM products LEFT JOIN orderlist ON products.product_id = orderlist.product_id WHERE orderlist.user_id = ${userId}`;
            const [cardData]:any = await pool.query(getCardQuery);

            const getThemes = `SELECT users.themes as themeId, vkard_layouts.vkard_style, vkard_layouts.image FROM users LEFT JOIN vkard_layouts ON users.vcard_layouts = vkard_layouts.id WHERE users.id = ${userId} LIMIT 1`;
            const [themeData]:any = await pool.query(getThemes);

            userRows[0].social_sites = socialRows || [];
            userRows[0].cardData = cardData || [];
            userRows[0].activeTheme = themeData[0] || {};

            return apiResponse.successResponse(res, "Get user profile data!", userRows[0]);
        } else {
            return apiResponse.errorMessage(res, 400, "User not found!");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const updateProfile =async (req:Request, res:Response) => {
    try {
        const userId: string = res.locals.jwt.userId;
        const { name, designation, companyName, dialCode, phone, email, website, address } = req.body;

        const checkUser = `SELECT * FROM users where deleted_at IS NULL AND (phone = ? || email = ?) AND id != ? LIMIT 1`;
        const checkUserVALUES = [phone, email, userId];
        const [rows]:any = await pool.query(checkUser, checkUserVALUES);

        if (rows.length > 0) {
            const dupli = [];
            if(email === rows[0].email){
                dupli.push("email")
            }
            if(phone === rows[0].phone){
                 dupli.push("phone")
             }
             if (dupli.length > 0) {
                return await apiResponse.errorMessage(res,400,`${dupli.join()} is already exist, Please change`);
             }
        }

        const updateQuery = `UPDATE users SET name = ?, designation = ?, company_name = ?, dial_code = ?, phone = ?, email = ?, website = ?, address = ? WHERE id = ?`;
        const VALUES = [name, designation, companyName, dialCode, phone, email, website, address, userId];
        const [data]:any = await pool.query(updateQuery, VALUES);

        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res,"Profile updated successfully !", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to update the user, please try again later !");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const updateImage =async (req:Request, res:Response) => {
    const userId: string = res.locals.jwt.userId;
    const { profileImage, coverImage } = req.body;

    const sql = `UPDATE users SET thumb = ?, cover_photo = ? WHERE id = ?`;
    const VALUES = [profileImage, coverImage, userId];
    const [rows]:any = await pool.query(sql, VALUES);

    if (rows.affectedRows > 0) {
        return apiResponse.successResponse(res, "Image Updated Sucessfully", null);
    } else {
        return apiResponse.errorMessage(res, 400, "Failed to update image, try again");
    }
}

// ====================================================================================================
// ====================================================================================================
