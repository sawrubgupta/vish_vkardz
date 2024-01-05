import { Request, Response } from "express";
import pool from '../../../../dbV2';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';

//v4
export const updatePackage =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const createdAt = utility.dateWithFormat();

        let paymentType = req.body.paymentType;
        const { txnId, priceCurrencyCode, packageSlug, price, status, packageType, couponDiscount, gstAmount } = req.body;
        const endDate = utility.extendedDateWithFormat(`${packageType}`);

        if (paymentType === "stripe") {
            paymentType = '2';
        } else if (paymentType === "razorpay") {
            paymentType = '3';
        } else if (paymentType === "paypal") {
            paymentType = '4';
        } else {
            paymentType = '1';
        }

        const userSql = `SELECT * FROM users WHERE id = ${userId} LIMIT 1`;
        const [userRows]:any = await pool.query(userSql);
        if (userRows.length === 0) return apiResponse.errorMessage(res, 400, "User not found");

        const sql = `INSERT INTO all_payment_info(txn_id, user_id, username, email, package, currency_code, price, payment_type, coupon_discount, gst_amount, status, created_at, approve_time) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const VALUES = [txnId, userId, userRows[0].username, userRows[0].email, packageSlug, priceCurrencyCode, price, paymentType, couponDiscount, gstAmount, status, createdAt, '0000-00-00 00:00:00'];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            const checkPackageSql = `SELECT * FROM users_package WHERE user_id = ${userId} LIMIT 1`;
            const [packageData]:any = await pool.query(checkPackageSql);

            let packageSql:any;
            let packageVALUES:any;
            if (packageData.length > 0) {
                packageSql = `UPDATE users_package SET package_slug = ?, start_time = ?, end_time = ?, expired_at = ?, updated_at = ? WHERE user_id = ?`;
                packageVALUES = [packageSlug, createdAt, endDate, endDate, createdAt, userId];
            } else {
                packageSql = `INSERT INTO users_package(user_id, package_slug, start_time, end_time, expired_at, created_at) VALUES(?, ?, ?, ?, ?, ?)`;
                packageVALUES = [userId, packageSlug, createdAt, endDate, endDate, createdAt];
            }

            const [packageRows]:any = await pool.query(packageSql, packageVALUES);    

            if (packageRows.affectedRows > 0) {
                return apiResponse.successResponse(res, "Package Updatesd Successfully", null);
            } else {
                return apiResponse.errorMessage(res, 400, "Failed to update package, Contact Support!");
            }

        } else {
            return apiResponse.errorMessage(res, 400, "Something Went Wrong, Contact Support!");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
