import pool from '../../../../db';
import { Request, Response } from "express";
import * as apiResponse from '../../helper/apiResponse';
import config  from '../../config/development';
import * as utility from "../../helper/utility";

export const getCategories =async (req:Request, res:Response) => {
    try {
        const sql = `SELECT * FROM product_type WHERE status = 1`;
        const [rows]:any = await pool.query(sql);

        if (rows.length > 0) {
            return apiResponse.successResponse(res, "Category get successfully", rows)
        } else {
            return apiResponse.successResponse(res, "No Data Found", null);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const getProductByCategoryId =async (req:Request, res:Response) => {
    try {
        const categoryId = req.query.categoryId;
        if (!categoryId) {
            return apiResponse.errorMessage(res, 400, "Please Add Category Id");
        }
        let keyword = req.query.keyword;

        var getPage:any = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page ) {
            page = 1;
        }
        var page_size: any = config.pageSize;       
        const offset = (page - 1 ) * page_size;

        const getPageQuery = `SELECT products.product_id FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id WHERE products.type = ${categoryId} AND products.status = 1 AND products.name LIKE '%${keyword}%'`;
        const [result]:any= await pool.query(getPageQuery);

        const sql = `SELECT products.product_id, products.name, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id WHERE products.type = ${categoryId} AND products.status = 1 AND products.name LIKE '%${keyword}%' ORDER BY created_at desc limit ${page_size} offset ${offset}`;
        const [rows]:any = await pool.query(sql);
        let totalPages:any = result.length/page_size;
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
            return apiResponse.successResponse(res, "Data not found", null);
        }

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
