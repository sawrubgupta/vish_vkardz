import { Request, Response } from "express";
import pool from '../../../../dbV2';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';
import resMsg from '../../config/responseMsg';

const setSecurityPinResMsg = resMsg.profile.setSecurityPin;

//according v2
export const setPin =async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.body.type; //type = business, user, null
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, setSecurityPinResMsg.setPin.nullUserId);

        const { securityPin, profileId } = req.body;
        
        const sql = `UPDATE users_profile SET set_password = ? WHERE user_id = ? AND id = ?`;
        const VALUES = [securityPin, userId, profileId]
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, setSecurityPinResMsg.setPin.successMsg, null)
        } else {
            return apiResponse.errorMessage(res, 400, setSecurityPinResMsg.setPin.failedMsg);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}
// ====================================================================================================
// ====================================================================================================

//according v2
export const removePin =async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, setSecurityPinResMsg.removePin.nullUserId);
        const profileId = req.query.profileId;

        const sql = `UPDATE users_profile SET set_password = null WHERE user_id = ${userId} AND id = ${profileId}`;
        const [rows]:any = await pool.query(sql);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, setSecurityPinResMsg.removePin.successMsg, null);
        } else {
            return apiResponse.errorMessage(res, 400, setSecurityPinResMsg.removePin.failedMsg);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const validatePin =async (req:Request, res:Response) => {
    try {
        const { username, pin } = req.body;

        const sql = `SELECT * FROM users WHERE username = '${username}' LIMIT 1`;
        const [rows]:any = await pool.query(sql);
        if (rows.length === 0) return apiResponse.errorMessage(res, 400, setSecurityPinResMsg.validatePin.invalidUsername);

        const profileSql = `SELECT set_password FROM users_profile `
        // if (rows[0].is_password_enable === 0) {
        //     return apiResponse.successResponse(res, "Profile Pin is disabled", null);
        // }
        if (pin == rows[0].set_password) {
            return apiResponse.successResponse(res, setSecurityPinResMsg.validatePin.successMsg, null);
        } else {
            return apiResponse.errorMessage(res, 400, setSecurityPinResMsg.validatePin.wrongPinMsg);
        }

    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================
