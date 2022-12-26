import pool from '../../../../db';
import { Request, Response } from "express";
import * as apiResponse from '../../helper/apiResponse';
import config  from '../../config/development';
import * as utility from "../../helper/utility";

export const coupnDiscount =async (req:Request, res:Response) => {
    try {
        const couponCode = req.query.couponCode;
        if (!couponCode || couponCode === "" || couponCode === undefined) {
            return apiResponse.errorMessage(res, 400, "Please enter a coupon code");
        }
        const createdAt = utility.dateWithFormat();
        
        const checkCouponCodeQuery = `SELECT coupon_code, discount_amount, discount_type FROM coupons WHERE coupon_code = ? AND expiration_date >= ?`;
        const VALUES = [couponCode, createdAt];
        
        const [rows]:any = await pool.query(checkCouponCodeQuery, VALUES);
        
        if (rows.length === 0) {
            return apiResponse.errorMessage(res, 400, "Invalid Coupon Code!!");
        } else {
            return apiResponse.successResponse(res, "Coupon Code Verified", rows[0]);
        }

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const couponRedemptions =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        const { couponCode, totalDiscount } = req.body;
        const createdAt = utility.dateWithFormat();

        const sql = `INSERT INTO coupon_redemptions(customer_id, coupon_code, total_discount, redemption_date) VALUES(?, ?, ?, ?)`;
        const VALUES = [userId, couponCode, totalDiscount, createdAt];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Coupon Redeem Sucessfully", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to reedem coupon");
        }

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}
// ====================================================================================================
// ====================================================================================================
