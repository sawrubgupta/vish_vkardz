import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';

export const switchToPublic =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const isPrivate = req.body.isPrivate;

        const sql = `UPDATE users SET is_private = ? WHERE id = ?`;
        const VALUES = [isPrivate, userId];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Account Switch Successfully", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to Switch Account, Please try again!");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
