import pool from '../../../../db';
import { Request, Response } from "express";
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";

export const deleteAccount =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const createdAt = utility.dateWithFormat();
console.log(userId);

        console.log(createdAt);
        
        const sql = `UPDATE users SET status = ?, deleted_at = ? WHERE id = ?`;
        const VALUES = [0, createdAt, userId];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Account Deleted Successfully", null)
        } else {
            return apiResponse.errorMessage(res, 400, "Failed, try again");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}
// ====================================================================================================
// ====================================================================================================
