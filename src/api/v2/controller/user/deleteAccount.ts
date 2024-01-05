import pool from '../../../../dbV2';
import { Request, Response } from "express";
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import resMsg from '../../config/responseMsg';

const deleteAccountMsg = resMsg.user.deleteAccount;

export const deleteAccount =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const createdAt = utility.dateWithFormat();
        
        const sql = `UPDATE users SET status = ?, deleted_at = ? WHERE id = ?`;
        const VALUES = [0, createdAt, userId];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            const sql = `UPDATE users_profile SET deleted_at = ? WHERE user_id = ?`;
            const VALUES = [createdAt, userId];
            const [rows]: any = await pool.query(sql, VALUES);
    
            const userCardSql = `UPDATE user_card SET deactivated_at = ? WHERE user_id = ?`;
            const cardVALUES = [createdAt, userId];
            const [cardRows]:any = await pool.query(userCardSql, cardVALUES);

            return apiResponse.successResponse(res, deleteAccountMsg.deleteAccount.successMsg, null)
        } else {
            return apiResponse.errorMessage(res, 400, deleteAccountMsg.deleteAccount.failedMsg);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}
// ====================================================================================================
// ====================================================================================================
