import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';


export const setPin =async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        if (type && type === config.businessType) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "User Id is required!");
        }

        const isPasswordEnable = req.body.isPasswordEnable;
        const securityPin = req.body.securityPin;
        
        const sql = `UPDATE users SET is_password_enable = ?, set_password = ? WHERE id = ?`;
        const VALUES = [isPasswordEnable, securityPin, userId]
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

export const removePin =async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        if (type && type === config.businessType) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "User Id is required!");
        }

        const sql = `UPDATE users SET is_password_enable = 0 WHERE id = ${userId}`;
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
