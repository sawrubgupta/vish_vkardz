import { Request, Response, NextFunction } from "express";
import pool from "../../../../dbV2";
import * as utility from "../../helper/utility";
import * as apiResponse from '../../helper/apiResponse';
import config from '../../config/development';
import { getQr, generateQr } from "../../helper/qrCode";
import resMsg from '../../config/responseMsg';

const multiProfileResMsg = resMsg.profile.multiProfile;

export const profileListing = async (req: Request, res: Response) => {
    try {
        // const userId = res.locals.jwt.userId;
        let userId: any;
        const type = req.query.type; //type = business, user, null
        if (type && (type === config.businessType || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, multiProfileResMsg.profileListing.nullUserId);


        const sql = `SELECT users_profile.id, users_package.package_slug AS package_name, users_profile.theme_name, users_profile.vcard_layouts, users_profile.hit, users_profile.share_link, users_profile.profile_image, users_profile.cover_photo, users_profile.qr_code, users_profile.vcard_layouts, users_profile.vcard_bg_color, users_profile.font, users_profile.is_private, users_profile.is_default, users_profile.set_password, users_profile.on_tap_url, users_profile.primary_profile_link, users_profile.is_card_linked FROM users_profile LEFT JOIN users_package ON users_package.user_id = users_profile.user_id WHERE users_profile.user_id = ${userId} AND users_profile.deleted_at IS NULL`;
        const [rows]: any = await pool.query(sql);

        const vcfInfoSql = `SELECT * FROM vcf_info WHERE user_id = ${userId} AND (type = '${config.vcfName}' OR type = '${config.vcfDesignation}')`;
        const [vcfInfoRows]: any = await pool.query(vcfInfoSql);

        const cardSql = `SELECT user_card.id, user_card.profile_id, user_card.product_type, card_activation.card_key, user_card.card_number, user_card.card_number_fix, user_card.card_image, user_card.is_card_linked FROM user_card LEFT JOIN card_activation ON 'card_ativation.card_number' = 'user_card.card_number' WHERE user_card.user_id = ${userId} AND user_card.deactivated_at IS NULL`;

        // const cardSql = `SELECT id, profile_id, card_number, card_number_fix, card_image, is_card_linked FROM user_card WHERE user_id = ${userId} AND deactivated_at IS NULL`; 
        const [cardRows]: any = await pool.query(cardSql);

        // const cardKeySql = `SELECT id, card_key, card_number FROM card_activation WHERE card_number = ''`

        let rowsIndex = -1;
        let vcfInfoIndex = -1;
        let cardIndex = -1;

        for (const ele of rows) {
            // ele.package_name = ele?.package_name ?? null
            rowsIndex++;
            rows[rowsIndex].name = null;
            rows[rowsIndex].designation = null;
            rows[rowsIndex].cardData = [];

            for (const vcfInfoEle of vcfInfoRows) {
                vcfInfoIndex++;
                if (ele.id == vcfInfoEle.profile_id) {
                    if (vcfInfoEle.type === config.vcfName) rows[rowsIndex].name = vcfInfoEle.value;
                    if (vcfInfoEle.type === config.vcfDesignation) rows[rowsIndex].designation = vcfInfoEle.value;
                }
            }

            for (const cardEle of cardRows) {
                cardIndex++
                if (cardEle.profile_id === ele.id) {
                    (rows[rowsIndex].cardData).push(cardEle)
                }
            }
        }
        return apiResponse.successResponse(res, multiProfileResMsg.profileListing.successMsg, rows);

    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const profileDetail = async (req: Request, res: Response) => {
    try {
        // const userId = res.locals.jwt.userId;
        let userId: any;
        const type = req.query.type; //type = business, user, null
        if (type && (type === config.businessType || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, multiProfileResMsg.profileDetail.nullUserId);

        const profileId = req.query.profileId;

        const sql = `SELECT id, profile_image, hit, share_link, theme_name, vcard_layouts, cover_photo, qr_code, vcard_layouts, vcard_bg_color, font, is_private, set_password, on_tap_url, primary_profile_link, is_card_linked FROM users_profile WHERE user_id = ${userId} AND id = ${profileId} AND users_profile.deleted_at IS NULL LIMIT 1`;
        const [rows]: any = await pool.query(sql);
        if (rows.length == 0) return apiResponse.errorMessage(res, 400, multiProfileResMsg.profileDetail.profileNotFound);

        rows[0].package_name = null;
        const packageSql = `SELECT package_slug AS package_name FROM users_package WHERE user_id = ${userId} LIMIT 1`;
        const [packageRows]: any = await pool.query(packageSql);
        rows[0].package_name = packageRows[0]?.package_name ?? null;

        const userSql = `SELECT username, email, dial_code, phone FROM users WHERE id = ${userId} LIMIT 1`;
        const [userRows]: any = await pool.query(userSql);

        const vcfInfoSql = `SELECT id, profile_id, type, value FROM vcf_info WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [vcfInfoRows]: any = await pool.query(vcfInfoSql);

        const customSql = `SELECT * FROM vcf_custom_field WHERE user_id = ${userId} AND profile_id = ${profileId} AND status = 1 ORDER BY created_at DESC LIMIT 6`;
        const [customRows]: any = await pool.query(customSql);

        rows[0].vcfInfo = vcfInfoRows;
        rows[0].otherInfo = customRows || [];
        rows[0].userData = userRows[0] || {};

        // let vcfInfoIndex = -1;
        // rows[0].name = null;
        // rows[0].designation = null;
        // rows[0].gender = null;
        // rows[0].department = null;
        // rows[0].notes = null;
        // rows[0].dob = null;
        // rows[0].phone = [];
        // rows[0].email = [];
        // rows[0].address = [];
        // rows[0].company = [];
        // rows[0].website = [];

        // for (const vcfInfoEle of vcfInfoRows) {
        //     vcfInfoIndex++;

        //     if (vcfInfoEle.type === config.vcfName) rows[0].name = vcfInfoEle.value;
        //     if (vcfInfoEle.type === config.vcfDesignation) rows[0].designation = vcfInfoEle.value;
        //     if (vcfInfoEle.type === config.vcfGender) rows[0].gender = vcfInfoEle.value;
        //     if (vcfInfoEle.type === config.vcfDepartment) rows[0].department = vcfInfoEle.value;
        //     if (vcfInfoEle.type === config.vcfNotes) rows[0].notes = vcfInfoEle.value;
        //     if (vcfInfoEle.type === config.vcfDob) rows[0].dob = vcfInfoEle.value;
        //     if (vcfInfoEle.type === config.vcfNumber) rows[0].phone.push({ vcfInfoEle });
        //     if (vcfInfoEle.type === config.vcfEmail) rows[0].email.push(vcfInfoEle);
        //     if (vcfInfoEle.type === config.vcfAddress) rows[0].address.push(vcfInfoEle);
        //     if (vcfInfoEle.type === config.vcfCompany) rows[0].company.push(vcfInfoEle);
        //     if (vcfInfoEle.type === config.vcfWebsite) rows[0].website.push(vcfInfoEle);

        // }

        const getSocialSiteQuery = `SELECT social_sites.id, vcard_social_sites.id AS userSocialId, social_sites.name, social_sites.social_link, social_sites.social_img, social_sites.type, vcard_social_sites.status, social_sites.primary_profile, vcard_social_sites.value, vcard_social_sites.label, vcard_social_sites.orders FROM social_sites LEFT JOIN vcard_social_sites ON social_sites.id = vcard_social_sites.site_id AND vcard_social_sites.user_id = ${userId} AND vcard_social_sites.profile_id = ${profileId} HAVING vcard_social_sites.value IS NOT NULL ORDER BY vcard_social_sites.value DESC, vcard_social_sites.orders IS NULL ASC`;
        const [socialRows]: any = await pool.query(getSocialSiteQuery);

        const getThemes = `SELECT users_profile.vcard_layouts as themeId, vkard_layouts.vkard_style, vkard_layouts.image, 1 AS isDefault FROM users_profile LEFT JOIN vkard_layouts ON users_profile.vcard_layouts = vkard_layouts.id WHERE users_profile.id = ${profileId} AND vkard_layouts.status = 1 LIMIT 5`;
        const [themeData]: any = await pool.query(getThemes);

        const layoutSql = `SELECT id AS themeId, vkard_style, image, 0 AS isDefault FROM vkard_layouts WHERE id != ${themeData[0].themeId} AND vkard_layouts.status = 1 LIMIT 5`;
        const [layoutRows]: any = await pool.query(layoutSql);
        // for (const ele of layoutRows) {
        //     themeData.push(ele)
        // }
        layoutRows.unshift(themeData[0])

        rows[0].social_sites = socialRows || [];
        rows[0].themeData = layoutRows || [];

        return apiResponse.successResponse(res, multiProfileResMsg.profileDetail.successMsg, rows);

    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const addUpdateProfile =async (req:Request, res:Response) => {
    try {
        let userId: any;
        const type = req.body.type; //type = business, user, null
        if (type && (type === config.businessType || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
            // const checkPackageSql = `SELECT * FROM users_package WHERE user_id = ${userId} LIMIT 1`;
            // const [packageRows]: any = await pool.query(checkPackageSql);
            // if (packageRows.length === 0) return apiResponse.errorMessage(res, 400, multiProfileResMsg.addProfile.noPackageFound);
            // if (packageRows[0].package_slug != 'pro') return apiResponse.errorMessage(res, 400, multiProfileResMsg.addProfile.updatePackageMsg);
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, multiProfileResMsg.addProfile.nullUserId);

        // For latitud and logitude check add/update api(bottom in this file)
        const { profileId, themeName, vcfInfo, latitude, longitude } = req.body;
        const createdAt = utility.dateWithFormat();
        let profileIdUniq = utility.randomString(6);

        if (profileId && profileId != null) {
            const updateProfileSql = `UPDATE users_profile SET theme_name = '${themeName}' WHERE id = ${profileId}`;
            const [profileRows]: any = await pool.query(updateProfileSql);
    
            let vcfIds = [];
    
            for (const ele of vcfInfo) {
                const vcfId = ele.vcfId;
                const type = ele.type;
                const value = ele.value;
                if (vcfId && vcfId != null && vcfId != "") vcfIds.push(vcfId);
    
                if (value != "" && value != null) {
                    const sql = `SELECT * FROM vcf_info WHERE user_id = ${userId} AND profile_id = ${profileId} AND id = ${vcfId} LIMIT 1`;
                    const [rows]: any = await pool.query(sql);
    
                    if (rows.length > 0) {
                        const updateSql = `UPDATE vcf_info SET type = ?, value = ? WHERE id = ?`;
                        const VALUES = [type, value, vcfId];
                        const [updateRows]: any = await pool.query(updateSql, VALUES);
                    } else {
                        const insertSql = `INSERT INTO vcf_info(user_id, profile_id, type, value, created_at) VALUES(?, ?, ?, ?, ?)`;
                        const VALUES = [userId, profileId, type, value, createdAt];
                        const [insertRows]: any = await pool.query(insertSql, VALUES);
                        vcfIds.push(insertRows.insertId);
                    }
                }
                continue;
            }
    
            const delVcf = `DELETE FROM vcf_info WHERE user_id = ${userId} AND profile_id = ${profileId} AND id NOT IN(${vcfIds})`;
            const [delVcfRows]: any = await pool.query(delVcf);
    
            if (latitude != null && longitude != null) {
                const checkLatlong = `SELECT * FROM users_latlong WHERE user_id = ${userId} AND profile_id = ${profileId} LIMIT 1`;
                const [latlongRows]: any = await pool.query(checkLatlong);
                if (latlongRows.length > 0) {
                    const latlongSql = `UPDATE users_latlong SET latitude = ?, longitude = ?, status = ? WHERE user_id = ? AND profile_id = ?`;
                    const latlongVal = [latitude, longitude, 1, userId, profileId];
                    const [latlongRow]: any = await pool.query(latlongSql, latlongVal);
                } else {
                    const latlongSql = `INSERT INTO users_latlong(user_id, profile_id, latitude, longitude, status) VALUES(?, ?, ?, ?, ?)`;
                    const latlongVal = [userId, profileId, latitude, longitude, 1];
                    const [latlongRow]: any = await pool.query(latlongSql, latlongVal);
                }
            }
            return apiResponse.successResponse(res, multiProfileResMsg.updateProfile.successMsg, null);    
        } else {
            const limitSql = `SELECT * FROM user_limitations WHERE type = '${config.profileType}' AND status = 1 LIMIT 1`;
            const [limitRows]: any = await pool.query(limitSql);
            const profileLimit = limitRows[0]?.limitation ?? 10;
    
            const profileCountSql = `SELECT COUNT(id) AS totalProfile FROM users_profile WHERE deleted_at IS NULL AND user_id = ${userId}`;
            const [profileCountRows]: any = await pool.query(profileCountSql);
    
            if (profileCountRows[0].totalProfile >= profileLimit) return apiResponse.errorMessage(res, 400, `Profile limit reached. You can only have a maximum of ${profileLimit} profiles.`);
    
            // const { name, designation, department, company, website, address, dob, gender, notes } = req.body;
    
            // const checkProfile = `SELECT profile_id FROM users_profile WHERE (profile_id = '${profileId}' OR theme_name = '${themeName}') AND deleted_at IS NULL LIMIT 1`;
            // const [profileRows]: any = await pool.query(checkProfile);
            // if (profileRows.length > 0) return apiResponse.errorMessage(res, 400, "Profile Name already used, Please change it!");
    
            const qrData: any = await generateQr(profileIdUniq);
    
            const onTapUrl = `${config.vkardUrl}${profileIdUniq}`;
            const sql = `INSERT INTO users_profile(user_id, profile_id, theme_name, account_type, package_name, qr_code, on_tap_url, created_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`
            const VALUES = [userId, profileIdUniq, themeName, 16, config.proPlan, qrData, onTapUrl, createdAt];
            const [rows]: any = await pool.query(sql, VALUES);
    
            if (rows.affectedRows > 0) {
                let vcfInfoSql = `INSERT INTO vcf_info(user_id, profile_id, type, value, created_at) VALUES `;
                let result: any;
                for (const ele of vcfInfo) {
                    const type = ele.type;
                    const value = ele.value;
    
                    if (value != "" || value != null) {
    
                        vcfInfoSql = vcfInfoSql + `(${userId}, ${rows.insertId}, '${type}', '${value}', '${createdAt}'),`
                    }
                }
                result = vcfInfoSql.substring(0, vcfInfoSql.lastIndexOf(','));
                // console.log("result", result);
                const [vcfData]: any = await pool.query(result);
    
                const getFeatures = `SELECT * FROM features WHERE status = 1`;
                const [featureData]: any = await pool.query(getFeatures);
    
                let featureStatus: any;
                let featureResult: any;
                let addFeatures: any = `INSERT INTO users_features(feature_id, user_id, profile_id, status) VALUES`;
                for (const element of featureData) {
                    if (element.id === 1 || element.id === 2 || element.id === 13 || element.id === 15 || (element.id >= 19 && element.id !== 30 && element.id !== 31 && element.id !== 34 && element.id !== 35 && element.id !== 36 && element.id !== 38)) {
                        featureStatus = 1
                    } else {
                        featureStatus = 0
                    }
                    addFeatures = addFeatures + `(${element.id}, ${userId}, ${rows.insertId}, ${featureStatus}), `;
                    featureResult = addFeatures.substring(0, addFeatures.lastIndexOf(','));
                }
                const [userFeatureData]: any = await pool.query(featureResult);
    
                if (latitude != null && longitude != null) {
                    const latlongSql = `INSERT INTO users_latlong(user_id, profile_id, latitude, longitude, status) VALUES(?, ?, ?, ?, ?)`
                    const latlongVal = [userId, rows.insertId, latitude, longitude, 1];
                    const [latlongRows]: any = await pool.query(latlongSql, latlongVal);
                }
                return apiResponse.successResponse(res, multiProfileResMsg.addProfile.successMsg, null);
            } else {
                return apiResponse.errorMessage(res, 400, multiProfileResMsg.addProfile.failedMsg);
            }    

            // =================
        }

    } catch (e) {
        console.log(e);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const deleteProfile = async (req: Request, res: Response) => {
    try {
        // const userId = res.locals.jwt.userId;
        let userId: any;
        const type = req.body.type; //type = business, user, null
        if (type && (type === config.businessType || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, multiProfileResMsg.deleteProfile.nullUserId);

        const profileId = req.body.profileId;
        const createdAt = utility.dateWithFormat();

        if (!profileId || profileId === null) return apiResponse.errorMessage(res, 400, multiProfileResMsg.deleteProfile.invalidProfileId);

        const profileSql = `SELECT * FROM users_profile WHERE id = ${profileId} AND is_default = 1 LIMIT 1`;
        const [profileRows]: any = await pool.query(profileSql);
        if (profileRows.length > 0) return apiResponse.errorMessage(res, 400, multiProfileResMsg.deleteProfile.primaryProfileValidation);

        const checkCard = `SELECT * FROM user_card WHERE user_id = ${userId} AND profile_id = ${profileId} AND deactivated_at IS NULL LIMIT 1`;
        const [checkCardRows]:any = await pool.query(checkCard);
        if (checkCardRows.length > 0) return apiResponse.errorMessage(res, 400, multiProfileResMsg.deleteProfile.cardLinkMsg) ;

        const sql = `UPDATE users_profile SET deleted_at = ? WHERE user_id = ? AND id = ?`;
        const VALUES = [createdAt, userId, profileId];
        const [rows]: any = await pool.query(sql, VALUES);

        return apiResponse.successResponse(res, multiProfileResMsg.deleteProfile.successMsg, null);
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const cardList = async (req: Request, res: Response) => {
    try {
        let userId: any;
        const type = req.query.type; //type = business, user, null
        if (type && (type === config.businessType || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, multiProfileResMsg.cardList.nullUserId);

        const sql = `SELECT * FROM user_card WHERE user_id = ${userId}`;
        const [rows]: any = await pool.query(sql);

        if (rows.length > 0) {
            return apiResponse.successResponse(res, multiProfileResMsg.cardList.successMsg, rows);
        } else {
            return apiResponse.errorMessage(res, 400, multiProfileResMsg.cardList.noDataFoundMsg);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

//not used
export const addProfile = async (req: Request, res: Response) => {
    try {
        // const userId = res.locals.jwt.userId;
        let userId: any;
        const type = req.body.type; //type = business, user, null
        if (type && (type === config.businessType || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
            const checkPackageSql = `SELECT * FROM users_package WHERE user_id = ${userId} LIMIT 1`;
            const [packageRows]: any = await pool.query(checkPackageSql);
            if (packageRows.length === 0) return apiResponse.errorMessage(res, 400, multiProfileResMsg.addProfile.noPackageFound);
            if (packageRows[0].package_slug != 'pro') return apiResponse.errorMessage(res, 400, multiProfileResMsg.addProfile.updatePackageMsg);

        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, multiProfileResMsg.addProfile.nullUserId);

        const limitSql = `SELECT * FROM user_limitations WHERE type = '${config.profileType}' AND status = 1 LIMIT 1`;
        const [limitRows]: any = await pool.query(limitSql);
        const profileLimit = limitRows[0]?.limitation ?? 10;

        const profileCountSql = `SELECT COUNT(id) AS totalProfile FROM users_profile WHERE deleted_at IS NULL AND user_id = ${userId}`;
        const [profileCountRows]: any = await pool.query(profileCountSql);

        if (profileCountRows[0].totalProfile >= profileLimit) return apiResponse.errorMessage(res, 400, `Profile limit reached. You can only have a maximum of ${profileLimit} profiles.`);

        // const { name, designation, department, company, website, address, dob, gender, notes } = req.body;
        const { themeName, details, latitude, longitude } = req.body;
        const createdAt = utility.dateWithFormat();

        let profileId = utility.randomString(6);
        // const checkProfile = `SELECT profile_id FROM users_profile WHERE (profile_id = '${profileId}' OR theme_name = '${themeName}') AND deleted_at IS NULL LIMIT 1`;
        // const [profileRows]: any = await pool.query(checkProfile);
        // if (profileRows.length > 0) return apiResponse.errorMessage(res, 400, "Profile Name already used, Please change it!");

        const qrData: any = await generateQr(profileId);

        const onTapUrl = `${config.vkardUrl}${profileId}`;
        const sql = `INSERT INTO users_profile(user_id, profile_id, theme_name, account_type, package_name, qr_code, on_tap_url, created_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`
        const VALUES = [userId, profileId, themeName, 16, config.proPlan, qrData, onTapUrl, createdAt];
        const [rows]: any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            let vcfInfoSql = `INSERT INTO vcf_info(user_id, profile_id, type, value, created_at) VALUES `;
            let result: any;
            for (const ele of details) {
                const type = ele.type;
                const value = ele.value;

                if (value != "" || value != null) {

                    vcfInfoSql = vcfInfoSql + `(${userId}, ${rows.insertId}, '${type}', '${value}', '${createdAt}'),`
                }
            }
            result = vcfInfoSql.substring(0, vcfInfoSql.lastIndexOf(','));
            // console.log("result", result);
            const [vcfData]: any = await pool.query(result);

            const getFeatures = `SELECT * FROM features WHERE status = 1`;
            const [featureData]: any = await pool.query(getFeatures);

            let featureStatus: any;
            let featureResult: any;
            let addFeatures: any = `INSERT INTO users_features(feature_id, user_id, profile_id, status) VALUES`;
            for (const element of featureData) {
                if (element.id === 1 || element.id === 2 || element.id === 13 || element.id === 14 || element.id === 15 || (element.id >= 18)) {
                    featureStatus = 1
                } else {
                    featureStatus = 0
                }
                addFeatures = addFeatures + `(${element.id}, ${userId}, ${rows.insertId}, ${featureStatus}), `;
                featureResult = addFeatures.substring(0, addFeatures.lastIndexOf(','));
            }
            const [userFeatureData]: any = await pool.query(featureResult);

            if (latitude != null && longitude != null) {
                const latlongSql = `INSERT INTO users_latlong(user_id, profile_id, latitude, longitude, status) VALUES(?, ?, ?, ?, ?)`
                const latlongVal = [userId, rows.insertId, latitude, longitude, 1];
                const [latlongRows]: any = await pool.query(latlongSql, latlongVal);
            }
            return apiResponse.successResponse(res, multiProfileResMsg.addProfile.successMsg, null);
        } else {
            return apiResponse.errorMessage(res, 400, multiProfileResMsg.addProfile.failedMsg);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

//not used
export const updateProfile = async (req: Request, res: Response) => {
    try {
        // const userId = res.locals.jwt.userId;
        let userId: any;
        const type = req.body.type; //type = business, user, null
        if (type && (type === config.businessType || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, multiProfileResMsg.updateProfile.nullUserId);

        const { profileId, themeName, vcfInfo, latitude, longitude } = req.body;
        const createdAt = utility.dateWithFormat();

        // const checkPackageSql = `SELECT * FROM users_package WHERE user_id = ${userId} LIMIT 1`;
        // const [packageRows]: any = await pool.query(checkPackageSql);
        // if (packageRows.length === 0) return apiResponse.errorMessage(res, 400, "No packages found");
        // if (packageRows[0].package_slug != 'pro') return apiResponse.errorMessage(res, 400, "Update your package");

        // const checkProfile = `SELECT profile_id FROM users_profile WHERE theme_name = '${themeName}' AND id != ${profileId} AND deleted_at IS NULL LIMIT 1`;
        // const [profileRow]: any = await pool.query(checkProfile);
        // if (profileRow.length > 0) return apiResponse.errorMessage(res, 400, "Profile Name already used, Please change it!");

        const updateProfileSql = `UPDATE users_profile SET theme_name = '${themeName}' WHERE id = ${profileId}`;
        const [profileRows]: any = await pool.query(updateProfileSql);

        let vcfIds = [];

        for (const ele of vcfInfo) {
            const vcfId = ele.vcfId;
            const type = ele.type;
            const value = ele.value;
            if (vcfId && vcfId != null && vcfId != "") vcfIds.push(vcfId);

            if (value != "" && value != null) {
                const sql = `SELECT * FROM vcf_info WHERE user_id = ${userId} AND profile_id = ${profileId} AND id = ${vcfId} LIMIT 1`;
                const [rows]: any = await pool.query(sql);

                if (rows.length > 0) {
                    const updateSql = `UPDATE vcf_info SET type = ?, value = ? WHERE id = ?`;
                    const VALUES = [type, value, vcfId];
                    const [updateRows]: any = await pool.query(updateSql, VALUES);
                } else {
                    const insertSql = `INSERT INTO vcf_info(user_id, profile_id, type, value, created_at) VALUES(?, ?, ?, ?, ?)`;
                    const VALUES = [userId, profileId, type, value, createdAt];
                    const [insertRows]: any = await pool.query(insertSql, VALUES);
                    vcfIds.push(insertRows.insertId);
                }
            }
            continue;
        }

        const delVcf = `DELETE FROM vcf_info WHERE user_id = ${userId} AND profile_id = ${profileId} AND id NOT IN(${vcfIds})`;
        const [delVcfRows]: any = await pool.query(delVcf);

        if (latitude != null && longitude != null) {
            const checkLatlong = `SELECT * FROM users_latlong WHERE user_id = ${userId} AND profile_id = ${profileId} LIMIT 1`;
            const [latlongRows]: any = await pool.query(checkLatlong);
            if (latlongRows.length > 0) {
                const latlongSql = `UPDATE users_latlong SET latitude = ?, longitude = ?, status = ? WHERE user_id = ? AND profile_id = ?`;
                const latlongVal = [latitude, longitude, 1, userId, profileId];
                const [latlongRow]: any = await pool.query(latlongSql, latlongVal);
            } else {
                const latlongSql = `INSERT INTO users_latlong(user_id, profile_id, latitude, longitude, status) VALUES(?, ?, ?, ?, ?)`;
                const latlongVal = [userId, profileId, latitude, longitude, 1];
                const [latlongRow]: any = await pool.query(latlongSql, latlongVal);
            }
        }
        return apiResponse.successResponse(res, multiProfileResMsg.updateProfile.successMsg, null);
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================
