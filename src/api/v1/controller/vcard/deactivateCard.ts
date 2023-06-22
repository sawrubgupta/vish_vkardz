import { Request, Response, NextFunction } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import config from '../../config/development';

export const deactivateCard =async (req:Request, res:Response) => {
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

        const sql = `UPDATE users SET is_deactived = ?, account_type = ?, is_card_linked = ?, is_payment = ?, card_number = ?, card_number_fix = ? WHERE id = ?`;
        const VALUES = [1, 16, 0, 0, "", "", userId];
        const [rows]:any =await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Your card is Deactive Now!", null);
        } else {
            return apiResponse.errorMessage(res,400, "Failed to Deactive the card, please try again later !");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong")
    }
}

// ====================================================================================================
// ====================================================================================================
