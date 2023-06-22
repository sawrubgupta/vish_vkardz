import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';


export const orderHistory =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        
        const sql = `SELECT api.id AS orderId, api.created_at, api.payment_type, api.delivery_date, api.expected_date, p.product_image, p.product_id AS productId, p.name AS productName, p.slug, api.price, ol.qty, api.name, api.address, api.locality, api.city, api.country, api.phone_number, api.delivery_charges, api.cod, api.price AS totalPrice, api.price, api.status, api.order_status, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM all_payment_info AS api LEFT JOIN orderlist AS ol ON ol.order_id = api.id LEFT JOIN products AS p ON ol.product_id = p.product_id LEFT JOIN product_price ON p.product_id = product_price.product_id LEFT JOIN product_rating ON p.product_id = product_rating.product_id WHERE api.user_id = ${userId} GROUP BY api.id ORDER BY created_at DESC`;
        const [rows]:any = await pool.query(sql);

        const ongoingOrder:any = [];
        const deliveredOrder = [];
        const cancelOrder = [];

        let rowsIndex = -1;
        for (const iterator of rows) {
            rowsIndex++;
            if (iterator.order_status === 'delivered') {
                deliveredOrder.push(iterator);
            } else if(iterator.order_status === 'canceled'){
                cancelOrder.push(iterator)
            } else {
                ongoingOrder.push(iterator);
            }
        }
        if (rows.length > 0) {
            return res.status(200).json({
                status: true,
                ongoingOrder, deliveredOrder, cancelOrder, 
                message: "Data Rtrieved Successfully"
            })
            // return apiResponse.successResponse(res, "Data Rtrieved Successfully", rows);
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

        // const checkOrder = `SELECT status FROM all_payment_info WHERE user_id = ${userId} AND id = ${orderId} LIMIT 1`;
        // const [orderRows]:any = await pool.query(checkOrder);
        // if (orderRows.status === 'dele') {
            
        // } else {
            
        // }
        const sql = `UPDATE all_payment_info SET order_status = 'canceled' WHERE user_id = ${userId} AND id = ${orderId}`;
        const [rows]:any = await pool.query(sql);

        
        return apiResponse.successResponse(res, "your order was canceled!!", null);
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const orderSummary =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const orderId = req.query.orderId;
        if (!orderId || orderId === null || orderId === undefined) {
            return apiResponse.errorMessage(res, 400, "Invalid Order Id!");
        }

        // const sql = `SELECT all_payment_info.*, (price - delivery_charges - coupon_discount - gst_amount) AS itemsTotal FROM all_payment_info WHERE id = ${orderId} AND user_id = ${userId} LIMIT 1`;
        const sql = `SELECT all_payment_info.* FROM all_payment_info WHERE id = ${orderId} AND user_id = ${userId} LIMIT 1`;
        const [rows]:any = await pool.query(sql);

        if (rows.length > 0) {
            const orderListSql = `SELECT orderlist.order_id, orderlist.qty, orderlist.product_id, orderlist.sub_total, SUM(orderlist.sub_total) as itemTotal, products.name, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM orderlist LEFT JOIN products ON products.product_id = orderlist.product_id LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE orderlist.user_id = ${userId} AND orderlist.order_id = ${orderId} GROUP BY products.product_id ORDER BY orderlist.created_at DESC`;
            const [orderRows]:any = await pool.query(orderListSql);

            const userDetailQuery = `SELECT username, name, email, phone, country, thumb FROM users WHERE id = ${userId} LIMIT 1`;
            const [userRows]:any = await pool.query(userDetailQuery);
    
            const addressQuery = `SELECT * FROM delivery_addresses WHERE user_id = ${userId} ORDER BY is_default = 1 DESC LIMIT 1`;
            const [addressRows]:any = await pool.query(addressQuery);
    
            const orderStatusQuery = `SELECT * FROM order_tracking WHERE user_id = ${userId} AND order_id = ${orderId}`;
            const [orderStatusRows]:any = await pool.query(orderStatusQuery);
            
            const orderStatus = config.orderStatus;

            rows[0].itemsTotal = parseInt(orderRows[0].itemTotal);
            rows[0].orderDetal = orderRows || [];
            rows[0].userDetail = userRows[0] || {};
            rows[0].addressDetail = addressRows[0] || {};
            rows[0].vKardzPhone = config.vKardzPhone;
            rows[0].orderStatus = orderStatusRows || [];
            rows[0].orderTrackingStatus = orderStatus;

            return apiResponse.successResponse(res, "Order Summary get Successfully", rows[0]);
        } else {
            return apiResponse.successResponse(res, "No Data Found", null);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
