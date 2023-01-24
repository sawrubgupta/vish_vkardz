import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';


export const orderHistory =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        
        const sql = `SELECT api.id AS orderId, api.created_at, api.payment_type, p.product_image, p.name, api.price, ol.qty, api.name, api.address, api.locality, api.city, api.country, api.phone_number, api.delivery_charges, api.cod, api.price AS totalPrice, api.price, api.status FROM all_payment_info AS api LEFT JOIN orderlist AS ol ON ol.order_id = api.id LEFT JOIN products AS p ON ol.product_id = p.product_id WHERE api.user_id = ${userId} AND api.status != 'canceled' ORDER BY created_at DESC`;
        const [rows]:any = await pool.query(sql);

        if (rows.length > 0) {
            return apiResponse.successResponse(res, "Data Rtrieved Successfully", rows);
        } else {
            return apiResponse.successResponse(res, "No orders found", null);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const cancelOrder =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        const orderId = req.body.orderId;

        const sql = `UPDATE all_payment_info SET status = 'canceled' WHERE user_id = ${userId} AND id = ${orderId}`;
        const [rows]:any = await pool.query(sql);

        return apiResponse.successResponse(res, "your order was canceled!!", null);
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
