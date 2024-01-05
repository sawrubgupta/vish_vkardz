import { Request, Response } from "express";
import pool from '../../../../dbV2';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';


export const checkReferCode =async (req:Request, res:Response) => {
    try {
        const referralCode = req.query.referralCode;

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

        return apiResponse.successResponse(res, "In process", null);

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

        // const coinSql = `INSERT INTO user_coins(user_id, type, coin, used_coin_amount, coin_status, created_at, expired_at) VALUES(?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?)`;
        // const coinVALUES = [rows[0].id, config.referrerType, referAmountRows[0].referrer_coin, 0, config.activeStatus, createdAt, extendedDate[0], userId, config.refereeType, referAmountRows[0].referee_coin, 0, config.activeStatus, createdAt, extendedDate[0]];
        // const [coinRows]:any = await pool.query(coinSql, coinVALUES);
        const coinSql = `INSERT INTO user_coins(user_id, type, coin, used_coin_amount, coin_status, created_at, expired_at) VALUES(?, ?, ?, ?, ?, ?, ?)`;
        const coinVALUES = [rows[0].id, config.referrerType, referAmountRows[0].referrer_coin, 0, config.activeStatus, createdAt, extendedDate[0]];
        const [coinRows]:any = await pool.query(coinSql, coinVALUES);

        if (coinRows.affectedRows > 0) {
            const updateReferreData = `UPDATE users SET offer_coin = offer_coin + ${offerCoin} WHERE id = ${rows[0].id}`;
            const [data]:any = await pool.query(updateReferreData);

            // const updateRefereeData = `UPDATE users SET offer_coin = offer_coin + ${refereeCoin} WHERE id = ${userId}`;
            // const [refereeRows]:any = await pool.query(updateRefereeData);

            return apiResponse.successResponse(res, "success", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to verify refer code, Contact support!!");
        }
        
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const referCoinHistory =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;

        var getPage: any = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page) page = 1;
        var page_size: any = config.pageSize;
        const offset = (page - 1) * page_size;

        const getPageQuery = `SELECT COUNT(user_coins.id) AS length FROM user_coins LEFT JOIN users ON users.id = user_coins.user_id WHERE user_coins.user_id = ${userId} AND user_coins.type = '${config.referrerType}'`;
        const [result]: any = await pool.query(getPageQuery);

        const sql = `SELECT user_coins.id, user_coins.type, user_coins.coin, user_coins.used_coin_amount, user_coins.coin_status, user_coins.created_at, user_coins.expired_at,users.username, users.name, users.referral_code, users.offer_coin FROM user_coins LEFT JOIN users ON users.id = user_coins.user_id WHERE user_coins.user_id = ${userId} AND user_coins.type = '${config.referrerType}' ORDER BY user_coins.created_at DESC LIMIT ${page_size} OFFSET ${offset}`;
        const [rows]:any = await pool.query(sql);

        const referCodeSql = `SELECT referral_code FROM users WHERE id = ${userId} LIMIT 1`;
        const [referRows]:any = await pool.query(referCodeSql);

        let totalPages: any = result[0].length / page_size;
        let totalPage = Math.ceil(totalPages);
        let totalLength = result[0].length

        // rows.referCode = referRows[0]?.referral_code ?? "";
        const referCode = referRows[0]?.referral_code ?? "";

        var resData = {
            status: true,
            data: rows,
            totalPage: totalPage,
            currentPage: page,
            totalLength: totalLength,
            referCode: referCode,
            message: "Data Retrieved Successfully",
        };
        return res.status(200).json(resData);
    
        // return apiResponse.successResponseWithPagination(res, "Data Retrieved Successfully", rows, totalPage, page, totalLength);

    } catch (e) {
        console.log(e);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================
