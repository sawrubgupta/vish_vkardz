import { Request, Response } from "express";
import pool from '../../../../dbV2';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';
import resMsg from '../../config/responseMsg';

const primaryProfileResMsg = resMsg.profile.primaryProfile;

//old (most probably not used)
export const setPrimaryProfile =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const primaryProfileSlug = req.body.primaryProfileSlug;
        let vcardLink = `https://vkardz.com/`

        const checkSocialSite = `SELECT label, value FROM vcard_social_sites WHERE user_id = ? AND label = ? LIMIT 1`;
        const siteVALUES = [userId, primaryProfileSlug];
        const [siteRows]:any = await pool.query(checkSocialSite, siteVALUES);

        if (siteRows.length > 0) {
            const link = siteRows[0].value;
            const primaryProfileQuery = `UPDATE users SET primary_profile_slug = ?, primary_profile_link = ? WHERE id = ?`;
            const VALUES = [primaryProfileSlug, link, userId];
            const [rows]:any = await pool.query(primaryProfileQuery, VALUES);

            if (rows.affectedRows > 0) {
                return apiResponse.successResponse(res, primaryProfileResMsg.setPrimaryProfile.successMsg, primaryProfileSlug);
            } else {
                return apiResponse.errorMessage(res, 400, primaryProfileResMsg.setPrimaryProfile.failedMsg);
            }
        } else if (primaryProfileSlug === 'vcard') {
            let uName:string;

            const getUser = `SELECT username, card_number, card_number_fix FROM users WHERE id = ${userId}`;
            const [userRows]:any = await pool.query(getUser);

            if (userRows[0].card_number !== null && userRows[0].card_number !== undefined && userRows[0].card_number !== '') {
                uName = userRows[0].card_number;
            } else if (userRows[0].card_number_fix !== null && userRows[0].card_number_fix !== undefined && userRows[0].card_number_fix !== '') {
                uName = userRows[0].card_number_fix;
            } else {
                uName = userRows[0].username
            }

            const vcardProfileLink = (vcardLink)+(uName);
            const primaryProfileQuery = `UPDATE users SET primary_profile_slug = ?, primary_profile_link = ? WHERE id = ?`;
            const VALUES = [primaryProfileSlug, vcardProfileLink, userId];
            const [rows]:any = await pool.query(primaryProfileQuery, VALUES);

            if (rows.affectedRows > 0) {
                return apiResponse.successResponse(res, primaryProfileResMsg.setPrimaryProfile.successMsg, primaryProfileSlug)
            } else {
                return apiResponse.errorMessage(res, 400, primaryProfileResMsg.setPrimaryProfile.failedMsg);
            }
        } else {
            return apiResponse.errorMessage(res, 400, `Please add '${primaryProfileSlug}' Information`);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const getPrimarySite =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;
        let addManual: any = {id: 0, name: "vcard"}

        const siteQuery = `SELECT id, name FROM social_sites WHERE primary_profile = 1`;
        const [siteRows]:any = await pool.query(siteQuery);

        const sql = `SELECT primary_profile_slug FROM users WHERE id = ${userId}`;
        const [userRows]:any = await pool.query(sql);

        siteRows.unshift(addManual);

        siteRows.forEach((a:any, b:any) => {
            userRows.forEach((a1:any, b1:any) => {
                if (siteRows[b].name === userRows[b1].primary_profile_slug || siteRows[b].name === addManual) {
                    siteRows[b].isActive = true;
                } else {
                    siteRows[b].isActive = false;
                }
            });
        });
        return apiResponse.successResponse(res, primaryProfileResMsg.getPrimarySite.successMsg, siteRows);
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

//new v4
export const addPrimaryLink = async (req: Request, res: Response) => {
    try {
        let userId:any; 
        const type = req.body.type; //type = business, user, null
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, "UserId id is required");
        const { profileId, primaryProfileLink } = req.body

        const primaryProfileQuery = `UPDATE users_profile SET primary_profile_link = ? WHERE id = ? AND user_id = ?`;
        const VALUES = [ primaryProfileLink, profileId, userId];
        const [rows]: any = await pool.query(primaryProfileQuery, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, primaryProfileResMsg.addPrimaryLink.successMsg, null);
        } else {
            return apiResponse.errorMessage(res, 400, primaryProfileResMsg.addPrimaryLink.failedMsg);
        }

    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================
