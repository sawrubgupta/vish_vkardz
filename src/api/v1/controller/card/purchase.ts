import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";


export const cardPurchase =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !");
        }
        const createdAt = utility.dateWithFormat();
        var paymentType = '';
        const { orderType } = req.body;
        if (orderType !== "online" && orderType !== "offline") {
            return apiResponse.errorMessage(res, 400, "Type not define");
        }
        const coinReedem = req.body.coinReedem;
        const deliveryDetails = req.body.deliveryDetails;
        const paymentInfo = req.body.paymentInfo;
        const orderlist = req.body.orderlist;

        if (orderType === "online") {
            if (paymentInfo.paymentType === "stripe") {
                paymentType = '2';
            } else if (paymentInfo.paymentType === "razorpay") {
                paymentType = '3';
            } else if (paymentInfo.paymentType === "paypal") {
                paymentType = '4';
            }

            const sql = `INSERT INTO all_payment_info(txn_id, user_id, username, email, currency_code, price, name, phone_number, locality, country, city, address, pincode, delivery_charges, payment_type, vat_num, status, created_at, approve_time) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const VALUES = [paymentInfo.txnId, userId, paymentInfo.username, paymentInfo.email, paymentInfo.price_currency_code, paymentInfo.price, deliveryDetails.name, deliveryDetails.phoneNumber, deliveryDetails.locality, deliveryDetails.country, deliveryDetails.city, deliveryDetails.address, deliveryDetails.pincode, paymentInfo.deliveryCharge, paymentType, deliveryDetails.vat_number, paymentInfo.status, createdAt, '0000-00-00 00:00:00'];
            const [rows]:any = await pool.query(sql, VALUES);

            if (rows.affectedRows > 0) {
                for await (const element of orderlist) {
                    const product_id =  element.product_id;
                    const qty =  element.qty;
                    const sub_total =  element.sub_total;
                }
            } else {
                return apiResponse.errorMessage(res, 400, "Purchase Failed, Please try again")
            }
        } else {
            
        }
    } catch (error) {
        console.log(error);
        return await apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}