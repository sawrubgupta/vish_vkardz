import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";

export const dealOfTheDay =async (req:Request, res:Response) => {
    try {
        const sql = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id WHERE products.status = 1 and is_todays_deal = 1`;
        const [rows]:any = await pool.query(sql);


        if (rows.length > 0) {
            return apiResponse.successResponse(res, "Deals of the day list", rows);
        } else {
            return apiResponse.successResponse(res, "No data found", null);
        }

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Somethong went wrong")
    }
}

// ====================================================================================================
// ====================================================================================================
