import pool from '../../../../db';
import { Request, Response } from "express";
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";

export const home =async (req:Request, res:Response) => {
    try {
        const type = req.query.type;

        const getBannerQuery = `SELECT * FROM dashboard_banner WHERE type LIKE '%${type}%'`;
        const [bannerData]:any = await pool.query(getBannerQuery);

        const getCardQuery = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id WHERE products.sub_cat = 'best-seller' AND products.status = 1`;
        const [bestSellerProducts]:any = await pool.query(getCardQuery);

        return res.status(200).json({
            status: true,
            bannerData, bestSellerProducts,
            message: "Data Retrieved Successfully"
        })
    } catch (error) {
        console.log(error);
        return await apiResponse.errorMessage(res, 400, "Somethong went wrong")
    }
}

// ====================================================================================================
// ====================================================================================================
