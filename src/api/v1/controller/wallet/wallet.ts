import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';


export const coinHistory =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;

        var getPage: any = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page) {
            page = 1;
        }
        var page_size: any = config.pageSize;
        const offset = (page - 1) * page_size;

        const getPageQuery = `SELECT COUNT(id) AS length FROM user_coins WHERE user_id = ${userId}`;
        const [result]: any = await pool.query(getPageQuery);

        const sql = `SELECT * FROM user_coins WHERE user_id = ${userId} ORDER BY created_at desc limit ${page_size} offset ${offset}`;
        const [rows]:any = await pool.query(sql);

        let totalPages: any = result[0].length / page_size;
        let totalPage = Math.ceil(totalPages);
        let totalLength = result[0].length

        // return apiResponse.successResponse
        return res.status(200).json({
            status: true,
            data: rows,
            totalPage: totalPage,
            currentPage: page,
            totalLength: totalLength,
            message: "Data Retrieved Sucessfully"
        })

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const reedemCouponCoin =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        const { couponCode } = req.body;
        if (!couponCode || couponCode === "" || couponCode === null) {
            return apiResponse.errorMessage(res, 400, "Invalid coupon");
        }
        const createdAt = utility.dateWithFormat();
        const extendedDate = utility.extendedDateAndTime("yearly");

        const checkCouponCodeQuery = `SELECT coupon_code, discount_amount, discount_type FROM coupons WHERE coupon_code = ? AND expiration_date >= ?`;
        const couponVALUES = [couponCode, createdAt];
        const [couponrows]:any = await pool.query(checkCouponCodeQuery, couponVALUES);

        if (couponrows.length === 0) {
            return apiResponse.errorMessage(res, 400, "Invalid Coupon Code!!");
        }
        const coins = couponrows[0].discount_amount;

        const chekCodeUsedQuery = `SELECT id FROM coupon_redemptions WHERE coupon_code = ? AND customer_id = ?`;
        const codeVALUES = [couponCode, userId];
        const [data]:any = await pool.query(chekCodeUsedQuery, codeVALUES);

        if (data.length > 0) {
            return apiResponse.errorMessage(res, 400, "This coupon code has already used");
        }

        const sql = `INSERT INTO coupon_redemptions(customer_id, coupon_code, total_discount, redemption_date) VALUES(?, ?, ?, ?)`;
        const VALUES = [userId, couponCode, coins, createdAt];
        const [rows]:any = await pool.query(sql, VALUES);


        if (rows.affectedRows > 0) {
            const coinSql = `INSERT INTO user_coins(user_id, type, coin, used_coin_amount, coin_status, created_at, expired_at) VALUES(?, ?, ?, ?, ?, ?, ?)`;
            const coinVALUES = [userId, config.couponRedeem, coins, 0, config.activeStatus, createdAt, extendedDate];
            const [coinRows]:any = await pool.query(coinSql, coinVALUES);

            const updateUser = `UPDATE users SET offer_coin = offer_coin + ${coins} WHERE id = ${userId}`;
            const [userRows]:any = await pool.query(updateUser);

            return apiResponse.successResponse(res, "Coupon Redeem Sucessfully", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to reedem coupon");
        }

    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================
