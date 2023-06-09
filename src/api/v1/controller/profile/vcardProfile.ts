import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';


export const vcardProfile =async (req:Request, res:Response) => {
    try {
        const username = req.body.username;
        const getUserQuery = `SELECT * FROM users WHERE id = ${username} LIMIT 1`;
        const [userRows]:any = await pool.query(getUserQuery);
        const userId:any = ''
        if (userRows.length > 0) {
            delete userRows[0].id;
            delete userRows[0].password;

            const getSocialSiteQuery = `SELECT social_sites.id, social_sites.name, social_sites.social_link, social_sites.social_img, social_sites.type, social_sites.status, social_sites.primary_profile, vcard_social_sites.value, vcard_social_sites.label, vcard_social_sites.orders FROM social_sites LEFT JOIN vcard_social_sites ON social_sites.id = vcard_social_sites.site_id AND vcard_social_sites.user_id = ${userId} HAVING vcard_social_sites.value IS NOT NULL ORDER BY vcard_social_sites.value DESC, vcard_social_sites.orders IS NULL ASC LIMIT 6`;
            const [socialRows]:any = await pool.query(getSocialSiteQuery);

            const getCardQuery = `SELECT products.slug, products.product_image, products.image_back, products.image_other FROM products LEFT JOIN orderlist ON products.product_id = orderlist.product_id WHERE orderlist.user_id = ${userId}`;
            const [cardData]:any = await pool.query(getCardQuery);

            const getThemes = `SELECT users.themes as themeId, vkard_layouts.vkard_style, vkard_layouts.image FROM users LEFT JOIN vkard_layouts ON users.vcard_layouts = vkard_layouts.id WHERE users.id = ${userId} LIMIT 1`;
            const [themeData]:any = await pool.query(getThemes);

            const cartSql = `SELECT COUNT(id) AS totalCartItem FROM cart_details WHERE user_id = ${userId}`;
            const [cartRows]:any = await pool.query(cartSql);

            const wishlistSql = `SELECT COUNT(id) AS totalWishlistItem FROM wishlist WHERE user_id = ${userId}`;
            const [wishlistRows]:any = await pool.query(wishlistSql);

            userRows[0].social_sites = socialRows || [];
            userRows[0].cardData = cardData || [];
            userRows[0].activeTheme = themeData[0] || {};
            userRows[0].totalCartItem = cartRows[0].totalCartItem || 0
            userRows[0].totalWishlistItem = wishlistRows[0].totalWishlistItem || 0

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
