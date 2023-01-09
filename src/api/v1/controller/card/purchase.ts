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
        // const isReturnPolicyAccepted = req.body.isReturnPolicyAccepted;
        // if (isReturnPolicyAccepted === 0) {
        //     return apiResponse.errorMessage(res, 400, "Please Accept return policy");
        // }
        const createdAt = utility.dateWithFormat();
        var paymentType = '';
        const { orderType, isGiftEnable, giftMessage } = req.body;
        if (orderType !== "online" && orderType !== "offline") {
            return apiResponse.errorMessage(res, 400, "Order type not define");
        }
        // let reedemCoinStatus = req.body.coinReedem;
        // let coins = req.body.reedemCoins.coins;
        const deliveryDetails = req.body.deliveryDetails;
        const paymentInfo = req.body.paymentInfo;
        const orderlist = req.body.orderlist;
        let rows:any;

        // if (reedemCoinStatus === true) {
        //     if (coins > 400) {
        //         coins = 400;
        //     }
        //     const reedemCoinQuery = `INSERT INTO reedem_coins (user_id, coins, created_at) VALUES (?, ?, ?)`
        //     const coinVALUES = [userId, coins, createdAt];
        //     const [coinRows]:any = await pool.query(reedemCoinQuery, coinVALUES);
        // }
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

            const sql = `INSERT INTO all_payment_info(txn_id, user_id, username, email, currency_code, price, name, phone_number, locality, country, city, address, pincode, contact_info, delivery_charges, payment_type, vat_num, note, is_gift_enable, gift_message, status, created_at, approve_time) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const VALUES = [paymentInfo.txnId, userId, paymentInfo.username, paymentInfo.email, paymentInfo.price_currency_code, paymentInfo.price, deliveryDetails.name, deliveryDetails.phoneNumber, deliveryDetails.locality, deliveryDetails.country, deliveryDetails.city, deliveryDetails.address, deliveryDetails.pincode, deliveryDetails.email, paymentInfo.deliveryCharge, paymentType, deliveryDetails.vat_number, paymentInfo.note, isGiftEnable, giftMessage, paymentInfo.status, createdAt, '0000-00-00 00:00:00'];
            [rows] = await pool.query(sql, VALUES);

        } else {
            const randomAlhpa= utility.randomString(4);
            const randomNum = Math.floor(Math.random() * (9999 - 1000));
            const offlineTrx = 'op-' + randomAlhpa + '-' + randomNum;
            const paymentType = 1;

            const offlineSql = `INSERT INTO all_payment_info(user_id, txn_id, username, email, currency_code, price, name, phone_number, locality, country, city, address, pincode, contact_info, delivery_charges, payment_type, vat_num, note, is_gift_enable, gift_message, status, created_at, approve_time) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const offlineVALUES = [userId, offlineTrx, paymentInfo.username, paymentInfo.email, paymentInfo.price_currency_code, paymentInfo.price, deliveryDetails.name, deliveryDetails.phoneNumber, deliveryDetails.locality, deliveryDetails.country, deliveryDetails.city, deliveryDetails.address, deliveryDetails.pincode, deliveryDetails.email, paymentInfo.deliveryCharge, paymentType, deliveryDetails.vat_number, paymentInfo.note, isGiftEnable, giftMessage, paymentInfo.status, createdAt, '0000-00-00 00:00:00'];
            [rows] = await pool.query(offlineSql, offlineVALUES);
        } 
        
        const paymentId = rows.insertId;
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
                // return apiResponse.successResponse(res, "Purchase Successfully!", null);
                return res.status(200).json({
                    status: true,
                    data: null,
                    paymentId: paymentId,
                    message: "Purchase Successfully!"
                })
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
