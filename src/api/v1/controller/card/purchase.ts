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
            return apiResponse.errorMessage(res, 400, "Order type not define");
        }
        const coinReedem = req.body.coinReedem;
        const deliveryDetails = req.body.deliveryDetails;
        const paymentInfo = req.body.paymentInfo;
        const orderlist = req.body.orderlist;
        let rows:any

        if (orderType === "online") {
            if (paymentInfo.paymentType === "stripe") {
                paymentType = '2';
            } else if (paymentInfo.paymentType === "razorpay") {
                paymentType = '3';
            } else if (paymentInfo.paymentType === "paypal") {
                paymentType = '4';
            } else {
                paymentType = '1';
            }

            const sql = `INSERT INTO all_payment_info(txn_id, user_id, username, email, currency_code, price, name, phone_number, locality, country, city, address, pincode, contact_info, delivery_charges, payment_type, vat_num, status, created_at, approve_time) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const VALUES = [paymentInfo.txnId, userId, paymentInfo.username, paymentInfo.email, paymentInfo.price_currency_code, paymentInfo.price, deliveryDetails.name, deliveryDetails.phoneNumber, deliveryDetails.locality, deliveryDetails.country, deliveryDetails.city, deliveryDetails.address, deliveryDetails.pincode, deliveryDetails.email, paymentInfo.deliveryCharge, paymentType, deliveryDetails.vat_number, paymentInfo.status, createdAt, '0000-00-00 00:00:00'];
            [rows] = await pool.query(sql, VALUES);

        } else {
            const randomAlhpa= utility.randomString(4);
            const randomNum = Math.floor(Math.random() * (9999 - 1000));
            const offlineTrx = 'op-' + randomAlhpa + '-' + randomNum;
            const paymentType = 1;

            const offlineSql = `INSERT INTO all_payment_info(user_id, txn_id, username, email, currency_code, price, name, phone_number, locality, country, city, address, pincode, contact_info, delivery_charges, payment_type, vat_num, status, created_at, approve_time) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const offlineVALUES = [userId, offlineTrx, paymentInfo.username, paymentInfo.email, paymentInfo.price_currency_code, paymentInfo.price, deliveryDetails.name, deliveryDetails.phoneNumber, deliveryDetails.locality, deliveryDetails.country, deliveryDetails.city, deliveryDetails.address, deliveryDetails.pincode, deliveryDetails.email, paymentInfo.deliveryCharge, paymentType, deliveryDetails.vat_number, paymentInfo.status, createdAt, '0000-00-00 00:00:00'];
            [rows] = await pool.query(offlineSql, offlineVALUES);
        } 
        
        let orderListSql:any = `INSERT INTO orderlist(user_id, order_id, product_id, qty, sub_total, created_at) VALUES `;
        let result:any = "";
        
        if (rows.affectedRows > 0) {
            for await (const element of orderlist) {
                const productId =  element.product_id;
                const qty =  element.qty;
                const subTotal =  element.sub_total;
                const orderId  = rows.insertId;
                
                orderListSql = orderListSql + `(${userId}, ${orderId}, ${productId}, ${qty}, '${subTotal}', '${createdAt}'),`;
                result = orderListSql.substring(0,orderListSql.lastIndexOf(','));
            }
            const [data]:any = await pool.query(result);
            if (data.affectedRows > 0) {
                return apiResponse.successResponse(res, "Purchase Successfully!", null);
            } else {
                return apiResponse.errorMessage(res, 400, "Something went wrong,please try again  later or contact our support team");
            }
        } else {
            return apiResponse.errorMessage(res, 400, "Purchase Failed, Please try again");
        }
          
    } catch (error) {
        console.log(error);
        return await apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
