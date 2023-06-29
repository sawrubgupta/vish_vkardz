import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import * as notify from "../../helper/notification"

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

            const sql = `INSERT INTO all_payment_info(txn_id, user_id, username, email, currency_code, price, name, phone_number, locality, country, city, address, pincode, contact_info, delivery_charges, payment_type, vat_num, note, is_gift_enable, gift_message, coupon_discount, gst_amount, status, created_at, approve_time) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const VALUES = [paymentInfo.txnId, userId, paymentInfo.username, paymentInfo.email, paymentInfo.price_currency_code, paymentInfo.price, deliveryDetails.name, deliveryDetails.phoneNumber, deliveryDetails.locality, deliveryDetails.country, deliveryDetails.city, deliveryDetails.address, deliveryDetails.pincode, deliveryDetails.email, paymentInfo.deliveryCharge, paymentType, deliveryDetails.vat_number, paymentInfo.note, isGiftEnable, giftMessage, paymentInfo.couponDiscount, paymentInfo.gstAmount, paymentInfo.status, createdAt, '0000-00-00 00:00:00'];
            [rows] = await pool.query(sql, VALUES);

        } else {
            const randomAlhpa= utility.randomString(4);
            const randomNum = Math.floor(Math.random() * (9999 - 1000));
            const offlineTrx = 'op-' + randomAlhpa + '-' + randomNum;
            const paymentType = 1;

            const offlineSql = `INSERT INTO all_payment_info(user_id, txn_id, username, email, currency_code, price, name, phone_number, locality, country, city, address, pincode, contact_info, delivery_charges, payment_type, vat_num, note, is_gift_enable, gift_message, status, order_status, created_at, approve_time) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const offlineVALUES = [userId, offlineTrx, paymentInfo.username, paymentInfo.email, paymentInfo.price_currency_code, paymentInfo.price, deliveryDetails.name, deliveryDetails.phoneNumber, deliveryDetails.locality, deliveryDetails.country, deliveryDetails.city, deliveryDetails.address, deliveryDetails.pincode, deliveryDetails.email, paymentInfo.deliveryCharge, paymentType, deliveryDetails.vat_number, paymentInfo.note, isGiftEnable, giftMessage, paymentInfo.status, 'placed', createdAt, '0000-00-00 00:00:00'];
            [rows] = await pool.query(offlineSql, offlineVALUES);
        } 
        
        const paymentId = rows.insertId;
        let orderListSql:any = `INSERT INTO orderlist(user_id, order_id, product_id, qty, sub_total, created_at) VALUES `;
        let result:any = "";
        
        // let customizeSql = `INSERT INTO customize_card(user_id, product_id, name, designation, qty, created_at) VALUES`;
        // const VALUES = [userId, productId, name, designation, qty, createdAt];
        // const customize_id = rows.insertId;

        // const addLogoQuery = `INSERT INTO customize_card_files(customize_id, type, file_name) VALUES (?, ?, ?)`;
        // const fileVALUES = [customize_id, "cusfile", logo];
        // const [data]:any = await pool.query(addLogoQuery, fileVALUES);
        const orderId  = rows.insertId;
        if (rows.affectedRows > 0) {
            for await (const element of orderlist) {
                const productId =  element.product_id;
                const qty =  element.qty;
                const subTotal =  element.sub_total;
                // const orderId  = rows.insertId;

                const isCustomizable = element.isCustomizable;
                const name = element.customizeName;
                const designation = element.customizeDesignation;
                const logo = element.customzeLogo;
                const customizeQty = element.customizeQty;
                
                orderListSql = orderListSql + `(${userId}, ${orderId}, ${productId}, ${qty}, '${subTotal}', '${createdAt}'),`;
                result = orderListSql.substring(0,orderListSql.lastIndexOf(','));

                if (isCustomizable === 1) {
                    let customizeSql = `INSERT INTO customize_card(user_id, product_id, name, designation, qty, created_at) VALUES(?, ?, ?, ?, ?, ?)`;
                    const VALUES = [userId, productId, name, designation, customizeQty, createdAt];
                    const [customizeRows]:any = await pool.query(customizeSql, VALUES)
                    const customize_id = customizeRows.insertId;
            
                    const addLogoQuery = `INSERT INTO customize_card_files(customize_id, type, file_name) VALUES (?, ?, ?)`;
                    const fileVALUES = [customize_id, "cusfile", logo];
                    const [data]:any = await pool.query(addLogoQuery, fileVALUES);
                }       
            }
            const [data]:any = await pool.query(result);

            const orderStatusQuery = `INSERT INTO order_tracking(user_id, order_id, status, expected_date, delivey_date) VALUES(?, ?, ?, ?, ?)`;
            const orderStatusValues = [userId, orderId, 'placed', createdAt, createdAt];
            const [orderStatusRows]:any = await pool.query(orderStatusQuery, orderStatusValues);

            
            if (data.affectedRows > 0) {
                const deleteCartQuery = `DELETE FROM cart_details WHERE user_id = ${userId}`;
                const [deleteCartRows]:any = await pool.query(deleteCartQuery);
                
                const getFcm = `SELECT fcm_token FROM users WHERE id = ${userId}`;
                const [rows]:any = await pool.query(getFcm);
             
                let fcm:any;
                for (const ele of rows) {
                    fcm = [ele.fcm_token];
                }
                var notificationData = {
                    title:"Order Completion",
                    body:`Your order received successfully`
                }
                const result = await notify.fcmSend(notificationData, fcm, null)
                const notificationQuery = `INSERT INTO notifications(user_id, identity, type, title, body, created_at) VALUES(?, ?, ?, ?, ?, ?)`;
                const VALUES = [userId, paymentId, 'purchase_card', notificationData.title, notificationData.body, createdAt];
                const [notificationRows]:any = await pool.query(notificationQuery, VALUES);
                // return apiResponse.successResponse(res, "Purchase Successfully!", null);
                return res.status(200).json({
                    status: true,
                    data: null,
                    paymentId: paymentId,
                    message: "Purchase Successfully!"
                })
                } else {
                return apiResponse.errorMessage(res, 400, "Something went wrong, please try again later or contact our support team");
            }
        } else {
            return apiResponse.errorMessage(res, 400, "Purchase Failed, Please try again");
        }
          
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
