import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';


export const checkReferCode =async (req:Request, res:Response) => {
    try {
        const referralCode = req.body.referralCode;

        const sql = `SELECT referral_code FROM users WHERE referral_code = ?`;
        const VALUES = [referralCode];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.length > 0) {
            return apiResponse.successResponse(res, "Referral Code Verified Successfully", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Invalid Refferal Code");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}
// ====================================================================================================
// ====================================================================================================

export const useReferCode =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const referralCode = req.body.referralCode;
        const createdAt = utility.dateWithFormat();

        const sql = `SELECT id, referral_code, offer_coin FROM users WHERE referral_code = ?`;
        const VALUES = [referralCode];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.length === 0) {
            return apiResponse.errorMessage(res, 400, "Invalid Refferal Code");
        } 
        const offerCoin = rows[0].offer_coin + 100;

        const addreferral = `INSERT INTO referrals(user_id, referrer_user_id, refer_code, created_at) VALUES(?, ?, ?, ?)`
        const referVALUES = [userId, rows[0].id, referralCode, createdAt];
        const [referRows]:any = await pool.query(addreferral, referVALUES);

        if (referRows.affectedRows > 0) {
            const updateReferreData = `UPDATE users SET offer_coin = ${offerCoin} WHERE id = ${rows[0].id}`;
            const [data]:any = await pool.query(updateReferreData);

            return apiResponse.successResponse(res, "success", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to verify refer code, Contact support!!");
        }
        
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrongr");
    }
}