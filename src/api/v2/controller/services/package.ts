import { Request, Response } from "express";
import pool from '../../../../dbV2';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config from '../../config/development';

export const getPackage = async (req: Request, res: Response) => {
    try {
        // const vari = ["Everything in vkardz", "Create Unlimited Profiles", "Link Profile to multiple cards", "Lifetime help & Support", "Unlimited Device Management", "Lifetime Analytics", "Link your card to an individual link"];
        // const str = vari.join();
        // console.log(str);

        const sql = `SELECT * FROM packages WHERE status = 1`;
        let [rows]: any = await pool.query(sql);

        let index = -1;
        for (const iterator of rows) {
            index++;
            rows[index].details = iterator.details.split(',');
        };

        return apiResponse.successResponse(res, "Package list get Successfully", rows);
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Somethng Went Wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

//old api   
export const updatePackage = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const createdAt = utility.dateWithFormat();
        const endDate = utility.extendedDateWithFormat("yearly");
        // return apiResponse.errorMessage(res, 400, "not working");
        let paymentType = req.body.paymentType;
        const { txnId, priceCurrencyCode, price, status } = req.body;

        if (paymentType === "stripe") {
            paymentType = '2';
        } else if (paymentType === "razorpay") {
            paymentType = '3';
        } else if (paymentType === "paypal") {
            paymentType = '4';
        } else {
            paymentType = '1';
        }

        // username, email, name, phone_number, locality, country, city, address,pincode, contact_info, delivery_charges, vat_num, note, is_gift_enable, gift_message,
        const sql = `INSERT INTO service_buy_payment_info(txn_id, user_id, package, currency_code, price, payment_type, status, start_date, end_date, created_at, approve_time) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const VALUES = [txnId, userId, 18, priceCurrencyCode, price, paymentType, status, createdAt, endDate, createdAt, '0000-00-00 00:00:00'];
        const [rows]: any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            const updateUser = ` UPDATE users SET account_type = ?, start_date = ?, end_date = ? WHERE id = ?`;
            const VALUES = [18, createdAt, endDate, userId];
            const [userRows]: any = await pool.query(updateUser, VALUES);

            if (userRows.affectedRows > 0) {
                return apiResponse.successResponse(res, "Survice buy successfully", null);
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
