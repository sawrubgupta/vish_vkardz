import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';


export const vcardProfile =async (req:Request, res:Response) => {
    try {
        let key:any = req.query.key;

        if (!key || key === null) return apiResponse.errorMessage(res, 400, "Invalid Key!");

        const splitCode = key.split(config.vcardLink);
        let newCardNum:any = splitCode[1] || '';

        let splitNewCardNumber = newCardNum.split('/');
        let newCardNumber = splitNewCardNumber[0] || newCardNum;

        const getUserQuery = `SELECT * FROM users WHERE deleted_at IS NULL AND (username = '${key}' OR username = '${newCardNumber}' OR card_number = '${key}' OR card_number = '${newCardNumber}' OR card_number_fix = '${key}' OR card_number_fix = '${newCardNumber}') LIMIT 1`;
        // const getUserQuery = `SELECT * FROM users WHERE deleted_at IS NULL AND username = 'abhi76' LIMIT 1`;
        const [userRows]:any = await pool.query(getUserQuery);

        if (userRows.length > 0) {
            const userId:any = userRows[0].id;

            let display_number = [userRows[0].display_number];
            let display_email = [userRows[0].display_email];
            let address = [userRows[0].address];
            let website = [userRows[0].website];
            let company_name = [userRows[0].company_name];
    
    
            delete userRows[0].id;
            delete userRows[0].password;

            delete userRows[0].display_number;
            delete userRows[0].display_email;
            delete userRows[0].address;
            delete userRows[0].website;
            delete userRows[0].company_name;

            // if (userRows[0].is_password_enable === 1) {
            //     const profilePin = req.query.profilePin;
            //     if (profilePin !== userRows[0].set_password || !profilePin) return apiResponse.errorMessage(res, 400, "Invalid pin!");
            // }
            const getSocialSiteQuery = `SELECT social_sites.id, social_sites.name, social_sites.social_link, social_sites.social_img, social_sites.type, social_sites.status, social_sites.primary_profile, vcard_social_sites.value, vcard_social_sites.label, vcard_social_sites.orders FROM social_sites LEFT JOIN vcard_social_sites ON social_sites.id = vcard_social_sites.site_id AND vcard_social_sites.user_id = ${userId} HAVING vcard_social_sites.value IS NOT NULL ORDER BY vcard_social_sites.value DESC, vcard_social_sites.orders IS NULL ASC`;
            const [socialRows]:any = await pool.query(getSocialSiteQuery);

            const customFieldSql = `SELECT icon, value, type FROM vcf_custom_field WHERE user_id = ${userId} AND status = 1`;
            const [vcfRows]:any = await pool.query(customFieldSql);
            // const getThemes = `SELECT users.themes as themeId, vkard_layouts.vkard_style, vkard_layouts.image FROM users LEFT JOIN vkard_layouts ON users.vcard_layouts = vkard_layouts.id WHERE users.id = ${userId} LIMIT 1`;
            // const [themeData]:any = await pool.query(getThemes);

            for await (const ele of vcfRows) {
                if (ele.type === config.vcfNumber || ele.type === config.vcfPhone) {
                    display_number.push(ele.value);
                } else if (ele.type === config.vcfEmail) {
                    display_email.push(ele.value);
                } else if (ele.type === config.vcfAddress) {
                    address.push(ele.value);
                } else if (ele.type === config.vcfCompany) {
                    company_name.push(ele.value);
                } else if (ele.type === config.vcfWebsite) {
                    website.push(ele.value);
                }
            }

            userRows[0].display_number = display_number || [];
            userRows[0].display_email = display_email || [];
            userRows[0].address = address || [];
            userRows[0].company_name = company_name || [];
            userRows[0].website = website || [];

            userRows[0].socialSites = socialRows || [];
            // userRows[0].customField = vcfRows || [];
            // userRows[0].activeTheme = themeData[0] || {};

            return apiResponse.successResponse(res, "Data Retrieved Successfuly", userRows[0]);
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

export const checkPinEnable =async (req:Request, res:Response) => {
    try {
        // const userId = res.locals.jwt.userId;
        let key:any = req.query.key;

        if (!key || key === null) return apiResponse.errorMessage(res, 400, "Invalid Key!");

        const splitCode = key.split(config.vcardLink);
        let newCardNum:any = splitCode[1] || '';

        let splitNewCardNumber = newCardNum.split('/');
        let newCardNumber = splitNewCardNumber[0] || newCardNum;

        const sql = `SELECT is_password_enable FROM users WHERE deleted_at IS NULL AND ((username = '${key}' OR username = '${newCardNumber}') OR (card_number = '${key}' OR card_number = '${newCardNumber}') OR (card_number_fix = '${key}' OR card_number_fix = '${newCardNumber}')) LIMIT 1`
        const [rows]:any = await pool.query(sql);

        if (rows.length === 0) return apiResponse.errorMessage(res, 400, "Activate your card");

        return apiResponse.successResponse(res, "Data Retrieved Successfully", rows[0]);
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
