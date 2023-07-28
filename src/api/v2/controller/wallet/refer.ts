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
        const extendedDate = utility.extendedDateAndTime("monthly");

        const sql = `SELECT id, referral_code, offer_coin FROM users WHERE referral_code = ?`;
        const VALUES = [referralCode];
        const [rows]:any = await pool.query(sql, VALUES);

        const refereeSql = `SELECT offer_coin FROM users WHERE id = ${userId} LIMIT 1`;
        const [refereeRows]:any = await pool.query(refereeSql);

        if (rows.length === 0) {
            return apiResponse.errorMessage(res, 400, "Invalid Refferal Code");
        } 
        const referAmountSql = `SELECT * FROM vkoin_limit LIMIT 1`;
        const [referAmountRows]:any = await pool.query(referAmountSql);

        const offerCoin = rows[0].offer_coin + referAmountRows[0].referrer_coin;
        const refereeCoin = refereeRows[0].offer_coin + referAmountRows[0].referee_coin;

        const addreferral = `INSERT INTO referrals(user_id, referrer_user_id, refer_code, created_at) VALUES(?, ?, ?, ?)`
        const referVALUES = [userId, rows[0].id, referralCode, createdAt];
        const [referRows]:any = await pool.query(addreferral, referVALUES);

        const coinSql = `INSERT INTO user_coins(user_id, type, coin, used_coin_amount, coin_status, created_at, expired_at) VALUES(?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?)`;
        const coinVALUES = [rows[0].id, config.referrerType, referAmountRows[0].referrer_coin, 0, config.activeStatus, createdAt, extendedDate[0], userId, config.refereeType, referAmountRows[0].referee_coin, 0, config.activeStatus, createdAt, extendedDate[0]];
        const [coinRows]:any = await pool.query(coinSql, coinVALUES);

        if (coinRows.affectedRows > 0) {
            const updateReferreData = `UPDATE users SET offer_coin = offer_coin + ${offerCoin} WHERE id = ${rows[0].id}`;
            const [data]:any = await pool.query(updateReferreData);

            const updateRefereeData = `UPDATE users SET offer_coin = offer_coin + ${refereeCoin} WHERE id = ${userId}`;
            const [refereeRows]:any = await pool.query(updateRefereeData);

            return apiResponse.successResponse(res, "success", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to verify refer code, Contact support!!");
        }
        
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrongr");
    }
}

// ====================================================================================================
// ====================================================================================================
