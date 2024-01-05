import pool from '../../../../dbV2';
import { Request, Response } from "express";
import * as apiResponse from '../../helper/apiResponse';
import config  from '../../config/development';
import * as utility from "../../helper/utility";
import responseMsg from '../../config/responseMsg';

const couponsResponseMsg = responseMsg.card.coupons;

export const coupnDiscount =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const couponCode = req.query.couponCode;
        if (!couponCode || couponCode === "" || couponCode === undefined) return apiResponse.errorMessage(res, 400, couponsResponseMsg.coupnDiscount.emptyCouponCode);
        const createdAt = utility.dateWithFormat();
        
        const checkCouponCodeQuery = `SELECT * FROM coupons WHERE coupon_code = ? AND expiration_date >= ?`;
        const VALUES = [couponCode, createdAt];
        console.log(VALUES);
        
        const [rows]:any = await pool.query(checkCouponCodeQuery, VALUES);
        
        if (rows.length === 0) {
            return apiResponse.errorMessage(res, 400, couponsResponseMsg.coupnDiscount.invalidCouponCode);
        } else {
            const chekCodeUsedQuery = `SELECT id FROM coupon_redemptions WHERE coupon_code = ? AND customer_id = ?`;
            const codeVALUES = [couponCode, userId];
            const [data]:any = await pool.query(chekCodeUsedQuery, codeVALUES);

            if (data.length > 0) {
                return apiResponse.errorMessage(res, 400, couponsResponseMsg.coupnDiscount.failedMsg);
            } else {
                return apiResponse.successResponse(res, couponsResponseMsg.coupnDiscount.successMsg, rows[0]);
            }
        }

    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const couponRedemptions =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        const { couponCode, totalDiscount } = req.body;
        const createdAt = utility.dateWithFormat();
        
        const checkCouponCodeQuery = `SELECT coupon_code, discount_amount, discount_type FROM coupons WHERE coupon_code = ? AND expiration_date >= ?`;
        const couponVALUES = [couponCode, createdAt];
        const [couponrows]:any = await pool.query(checkCouponCodeQuery, couponVALUES);
        
        if (couponrows.length === 0) return apiResponse.errorMessage(res, 400, couponsResponseMsg.couponRedemptions.invalidCouponCode);

        const chekCodeUsedQuery = `SELECT id FROM coupon_redemptions WHERE coupon_code = ? AND customer_id = ?`;
        const codeVALUES = [couponCode, userId];
        const [data]:any = await pool.query(chekCodeUsedQuery, codeVALUES);

        if (data.length > 0) return apiResponse.errorMessage(res, 400, couponsResponseMsg.couponRedemptions.invalidCouponCode);

        const sql = `INSERT INTO coupon_redemptions(customer_id, coupon_code, total_discount, redemption_date) VALUES(?, ?, ?, ?)`;
        const VALUES = [userId, couponCode, totalDiscount, createdAt];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, couponsResponseMsg.couponRedemptions.successMsg, null);
        } else {
            return apiResponse.errorMessage(res, 400, couponsResponseMsg.couponRedemptions.failedMsg);
        }

    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================
