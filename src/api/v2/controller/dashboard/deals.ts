import { Request, Response } from "express";
import pool from '../../../../dbV2';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import resMsg from '../../config/responseMsg';

const contactSyncResMsg = resMsg.dashboard.deals;

export const dealOfTheDay =async (req:Request, res:Response) => {
    try {
        const sql = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id WHERE products.status = 1 and is_todays_deal = 1`;
        const [rows]:any = await pool.query(sql);


        if (rows.length > 0) {
            let productIdsArr = [];
            for (const ele of rows) {
                let productId = ele.product_id;
                productIdsArr.push(productId);                
            }
            
            const productImageSql = `SELECT product_id, image FROM product_image WHERE product_id IN(${productIdsArr})`;
            const [productImageRows]:any = await pool.query(productImageSql);

            let rowIndex =-1
            let imageDataIndex = -1;
            for(const element of rows){
                rowIndex++;
                rows[rowIndex].productImg = []
    
                for(const imgEle of productImageRows){
                    imageDataIndex++;
                    if(element.product_id === imgEle.product_id){
                        (rows[rowIndex].productImg).push(imgEle.image);
                    }
                }
            }


            return apiResponse.successResponse(res, contactSyncResMsg.dealOfTheDay.successMsg, rows);
        } else {
            return apiResponse.successResponse(res, contactSyncResMsg.dealOfTheDay.noDataFoundMsg, null);
        }

    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================
