import { Request, Response } from "express";
import pool from '../../../../dbV2';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import _ from 'lodash';
import config from '../../config/development';


export const userToUserProfileDataTransfer = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const currentDate = utility.dateWithFormat();

        const accessCode = req.body.accessCode;
        if (accessCode != "vKardzDbDataTransfer") return apiResponse.errorMessage(res, 400, "You don't have access!!");
        // if (userId && !userId) return apiResponse.errorMessage(res, 400, "You don't have access!!");
        // return apiResponse.errorMessage(res, 400, "You don't have access!!");

        const userQuery = `SELECT * FROM users`;
        const [userRows]: any = await pool.query(userQuery);

        // const userProfileSql = `INSERT INTO users_profile(user_id, profile_image, cover_photo, hit, share_link, qr_code, language, vcard_layouts, vcard_bg_color, font, is_private, is_private, set_password, on_tap_url, is_default, created_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        let userProfileSql = `INSERT INTO users_profile(user_id, profile_image, cover_photo, hit, share_link, qr_code, language, vcard_layouts, vcard_bg_color, set_password, on_tap_url, is_default, created_at) VALUES `;
        let result: any;

        let packageSql = `INSERT INTO users_package(user_id, package_id, start_time, end_time) VALUES `;
        let packageResult:any;
        let VALUES:any

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

            const accountType = userEle.account_type;
            const startTime = userEle.start_date;
            const endTime = userEle.end_date;


            // userProfileSql = userProfileSql + ` (${userId}, '${thumb}', '${cover_photo}', ${hit}, ${share_link}, '${qr_code}', 'eng', ${vcard_layouts}, '${vcard_bg_color}', ${set_password}, '${primary_profile_link}', 1, '${currentDate}'), `;
            VALUES = VALUES + ` (${userId}, '${thumb}', '${cover_photo}', ${hit}, ${share_link}, '${qr_code}', 'eng', ${vcard_layouts}, '${vcard_bg_color}', ${set_password}, '${primary_profile_link}', 1, '${currentDate}'), `;
            result = userProfileSql.substring(0, userProfileSql.lastIndexOf(','));

            packageSql = packageSql + ` (${userId}, ${accountType}, '${startTime}', '${endTime}'), `;
            packageResult = packageSql.substring(0, packageSql.lastIndexOf(','));
        }
        console.log(result);

        const [rows]: any = await pool.query(result)
        if (rows.affectedRows > 0) {
            const [packageRows]:any = await pool.query(packageResult);
            
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

// ====================================================================================================
// ====================================================================================================

export const addUserNewFeature = async (req: Request, res: Response) => {
    try {
        // const userId = res.locals.jwt.userId;
        // if (userId || !userId) return apiResponse.errorMessage(res, 400, "you don't have access");

        const accessCode = req.body.accessCode;
        if (accessCode != "vKardzDbDataTransfer") return apiResponse.errorMessage(res, 400, "You don't have access!!");

        const userSql = `SELECT * FROM  `;
        const [userRows]: any = await pool.query(userSql);

        for (const userEle of userRows) {
            const uid = userEle.user_id;
            const profileId = userEle.id;

            const getFeatures = `SELECT * FROM features WHERE id between 18 AND 38`;
            const [featureData]: any = await pool.query(getFeatures);

            let featureStatus = 1;
            let featureResult;
            let addFeatures: any = `INSERT INTO users_features(feature_id, profile_id, user_id,status) VALUES`;
            for (const element of featureData) {
                // if (element.id === 1 || element.id === 2 || element.id === 13 || element.id === 14 || element.id === 15) {
                //     featureStatus = 1
                // } else {
                //     featureStatus = 0
                // }
                addFeatures = addFeatures + `(${element.id}, ${profileId}, ${uid}, ${featureStatus}), `;
                featureResult = addFeatures.substring(0, addFeatures.lastIndexOf(','));
            }
            const [userFeatureData]: any = await pool.query(featureResult);
            console.log("userFeatureData", userFeatureData);

        }
        return apiResponse.successResponse(res, "Success", null);
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const vcInfoDataAdd = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const currentDate = utility.dateWithFormat();

        const accessCode = req.body.accessCode;
        if (accessCode != "vKardzDbDataTransfer") return apiResponse.errorMessage(res, 400, "You don't have access!!");
        
        // if (userId && !userId) return apiResponse.errorMessage(res, 400, "You don't have access!!");
        // return apiResponse.errorMessage(res, 400, "You don't have access!!");
        const userQuery = `SELECT * FROM users`;
        const [userRows]: any = await pool.query(userQuery);

        // const userProfileSql = `INSERT INTO users_profile(user_id, profile_image, cover_photo, hit, share_link, qr_code, language, vcard_layouts, vcard_bg_color, font, is_private, is_private, set_password, on_tap_url, is_default, created_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        // let userProfileSql = `INSERT INTO users_profile(user_id, profile_image, cover_photo, hit, share_link, qr_code, language, vcard_layouts, vcard_bg_color, set_password, on_tap_url, is_default, created_at) VALUES `;
        // let result: any;

        let vcfSql = `INSERT INTO vcf_info(user_id, profile_id, type, value) VALUES `;
        let vcfResult:any;

        for await (const userEle of userRows) {
            const userId = userEle.id;
            const name = userEle.name;
            const email = userEle.email;
            const phone = userEle.phone;
            const website = userEle.website;
            const company_name = userEle.company_name;
            const address = userEle.address;
            const gender = userEle.gender;
            const designation = userEle.designation;

            // const accountType = userEle.account_type;
            // const startTime = userEle.start_date;
            // const endTime = userEle.end_date;

            // userProfileSql = userProfileSql + ` (${userId}, '${thumb}', '${cover_photo}', ${hit}, ${share_link}, '${qr_code}', 'eng', ${vcard_layouts}, '${vcard_bg_color}', ${set_password}, '${primary_profile_link}', 1, '${currentDate}'), `;
            // result = userProfileSql.substring(0, userProfileSql.lastIndexOf(','));

            // vcfSql = vcfSql + ` (${userId}, 0, '${config.vcfName}', '${name}'), (${userId}, 0, '${config.vcfEmail}', '${email}'), (${userId}, 0, '${config.vcfPhone}', '${phone}'), (${userId}, 0, '${config.vcfWebsite}', '${website}'), (${userId}, 0, '${config.vcfCompany}', '${company_name}'), (${userId}, 0, '${config.vcfAddress}', '${address}'), (${userId}, 0, '${config.vcfGender}', '${gender}'), (${userId}, 0, '${config.vcfDesignation}', '${designation}'),`;

            vcfSql = vcfSql + ` (${userId}, 0, '${config.vcfName}', '${name}'), (${userId}, 0, '${config.vcfEmail}', '${email}'), (${userId}, 0, '${config.vcfPhone}', '${phone}'), (${userId}, 0, '${config.vcfWebsite}', '${website}'), (${userId}, 0, '${config.vcfCompany}', '${company_name}'), (${userId}, 0, '${config.vcfAddress}', '${address}'), (${userId}, 0, '${config.vcfGender}', '${gender}'), (${userId}, 0, '${config.vcfDesignation}', '${designation}'),`;
            vcfResult = vcfSql.substring(0, vcfSql.lastIndexOf(','));
        }
        console.log("vcfSql", vcfSql);

        // const [rows]: any = await pool.query(result)
        // if (rows.affectedRows > 0) {
            // return await apiResponse.successResponse(res, "Transfer successfully", null);
            const [packageRows]:any = await pool.query(vcfResult);
            
            return await apiResponse.successResponse(res, "Transfer successfully", null);
        // } else {
        //     return await apiResponse.errorMessage(res, 400, "Failed!!");
        // }

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const cardDataTransfer =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const currentDate = utility.dateWithFormat();

        const accessCode = req.body.accessCode;
        if (accessCode != "vKardzDbDataTransfer") return apiResponse.errorMessage(res, 400, "You don't have access!!");

        const userSql = `SELECT id, card_number, card_number_fix, is_card_linked FROM users WHERE (card_number IS NOT NULL OR card_number_fix IS NOT NULL) AND card_number != ''`;
        const [userRows]:any = await pool.query(userSql)

        let sql = `INSERT INTO user_card(user_id, card_number, card_number_fix, is_card_linked, created_at) VALUES `;
        let result:any;
        for await (const ele of userRows) {
            const userId = ele.id;
            const card_number = ele.card_number;
            const card_number_fix = ele.card_number_fix;
            const is_card_linked = ele.is_card_linked
            
            sql = sql + ` (${userId}, '${card_number}', '${card_number_fix}', ${is_card_linked}, '${currentDate}'), `;

            result = sql.substring(0, sql.lastIndexOf(','));

        }

        const [rows]:any = await pool.query(result);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Data Transfer Successfully", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed");

        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================
