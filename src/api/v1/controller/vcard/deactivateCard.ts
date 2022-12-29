import { Request, Response, NextFunction } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';

export const deactivateCard =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;

        const sql = `UPDATE users SET is_deactived = ?, is_payment = ?, card_number = ?, card_number_fix = ? WHERE id = ?`;
        const VALUES = [1, 0, "", "", userId];
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
