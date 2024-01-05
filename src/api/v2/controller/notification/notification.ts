import pool from "../../../../dbV2";
import { Request, Response } from "express";
import * as apiResponse from '../../helper/apiResponse';
// import { dateWithFormat } from "../utility/utility";
// import fcmSend from "../../helper/notification";
import config from '../../config/development';
import * as notify from "../../helper/notification"

export const getNotification =async (req:Request, res: Response) => {
    try {
        const userId = res.locals.jwt.userId;
        let keyword = req.query.keyword;

        var getPage: any = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page) {
            page = 1;
        }
        var page_size: any = config.pageSize;
        const offset = (page - 1) * page_size;

        const getPageQuery = `SELECT id FROM notifications WHERE user_id = ${userId}`;
        const [result]: any = await pool.query(getPageQuery);

        const sql = `SELECT * FROM notifications WHERE user_id = ${userId} ORDER BY created_at desc limit ${page_size} offset ${offset}`;
        const [rows]:any = await pool.query(sql);

        let rowsIndex = -1;
        for (const ele of rows) {
            rowsIndex++;
            if (ele.type === config.cardPurchase) {
                const productSql = `SELECT products.name, products.product_image, products.image_back, products.image_other FROM products LEFT JOIN orderlist ON orderlist.product_id = products.product_id WHERE orderlist.order_id = ${ele.identity} LIMIT 1`;
                const [productRows]:any = await pool.query(productSql);

                rows[rowsIndex].productDetail = productRows[0] || {}; 
            }
        }
        let totalPages: any = result.length / page_size;
        let totalPage = Math.ceil(totalPages);

        if (rows.length > 0) {
            // return apiResponse.successResponse(res, "Products details are here", rows);
            return res.status(200).json({
                status: true,
                data: rows,
                totalPage: totalPage,
                currentPage: page,
                totalLength: result.length,
                message: "Products details are here"
            })
        } else {
            return apiResponse.errorMessage(res, 400, "Data not found");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const sendNotification =async (req:Request, res:Response) => {
    try {
        const notificationData = req.body.notification;
        const sendTo = req.body.sendTo;
        let fcmTokens:any[] = [];
        let fcmSql:any;

        if (sendTo === config.allUsers) {
            fcmSql = `SELECT fcm_token FROM users WHERE deleted_at IS NULL`;
        } else if (sendTo === config.activateUsers) {
            fcmSql = `SELECT fcm_token FROM users WHERE deleted_at IS NULL AND (card_number IS NOT NULL OR card_number != '')`;
        } else if (sendTo === config.deactivateUsers) {
            fcmSql = `SELECT fcm_token FROM users WHERE deleted_at IS NULL AND (card_number IS NULL OR card_number = '')`;
        } else if (sendTo === config.basicPlan) {
            fcmSql = `SELECT fcm_token FROM users WHERE deleted_at IS NULL AND account_type = 16`;
        } else if (sendTo === config.propersonalizePlan) {
            fcmSql = `SELECT fcm_token FROM users WHERE deleted_at IS NULL AND account_type = 18`;
        } else {
            fcmSql = `SELECT fcm_token FROM users WHERE deleted_at IS NULL`;
        }
        const [rows]:any = await pool.query(fcmSql);

        // console.log("rows", rows);
        
        for await (const ele of rows) {
            fcmTokens.push(ele.fcm_token)
        }
        var payload = notificationData.payload;
        var sendData = {
            title:notificationData.data.title,
            body:notificationData.data.body
        }

        // console.log("fcmTokens", fcmTokens);
        const result = await notify.fcmSend(sendData, fcmTokens, payload)

        return apiResponse.successResponse(res, "Notification send successfully", null);
    } catch (error) {
        console.log("error", error);
        
    }
}

// ====================================================================================================
// ====================================================================================================
