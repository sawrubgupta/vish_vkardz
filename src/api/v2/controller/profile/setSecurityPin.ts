import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';

//according v2
export const setPin =async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "User Id is required!");
        }

        const { securityPin, profileId } = req.body;
        
        const sql = `UPDATE users_profile SET set_password = ? WHERE user_id = ? AND id = ?`;
        const VALUES = [securityPin, userId, profileId]
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Profile Password Added Successfully", null)
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to add profle password");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
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
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "User Id is required!");
        }
        const profileId = req.query.profileId;

        const sql = `UPDATE users_profile SET set_password = null WHERE user_id = ${userId} AND id = ${profileId}`;
        const [rows]:any = await pool.query(sql);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Profile Pin Remove Successfully", null)
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to remove security pin, try again later");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const validatePin =async (req:Request, res:Response) => {
    try {
        const { username, pin } = req.body;

        const sql = `SELECT * FROM users WHERE username = '${username}' LIMIT 1`;
        const [rows]:any = await pool.query(sql);
        if (rows.length === 0) return apiResponse.errorMessage(res, 400, "Invalid username");

        if (rows[0].is_password_enable === 0) {
            return apiResponse.successResponse(res, "Profile Pin is disabled", null);
        }
        if (pin == rows[0].set_password) {
            return apiResponse.successResponse(res, "Profile pin verified", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Wrong profile pin");
        }

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
