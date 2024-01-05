import pool from '../../../../dbV2';
import { query, Request, Response } from "express";
import * as apiResponse from '../../helper/apiResponse';
import config from '../../config/development';
import * as utility from "../../helper/utility";
import responseMsg from '../../config/responseMsg';

const wishlistResponseMsg = responseMsg.card.wishlist;

export const addToWishlist = async (req: Request, res: Response) => {
    try {
        const userId: string = res.locals.jwt.userId;
        // if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, "Please login !");

        const createdAt = utility.dateWithFormat();
        const productId = req.query.productId;
        if (!productId || productId === "" || productId === undefined) return apiResponse.errorMessage(res, 400, wishlistResponseMsg.addToWishlist.nullProductIdMsg);

        const checkCartPoducts = `SELECT id FROM wishlist WHERE user_id = ${userId} AND product_id = ${productId} limit 1`;
        const [wishlistRows]: any = await pool.query(checkCartPoducts);

        if (wishlistRows.length > 0) {
            return apiResponse.errorMessage(res, 400, wishlistResponseMsg.addToWishlist.alreadyInWishlist);
        } else {
            const sql = `INSERT INTO wishlist(user_id, product_id, created_at) VALUES(?, ?, ?)`;
            const VALUES = [userId, productId, createdAt]
            const [rows]: any = await pool.query(sql, VALUES);

            if (rows.affectedRows > 0) {
                return apiResponse.successResponse(res, wishlistResponseMsg.addToWishlist.successMsg, null);
            } else {
                return apiResponse.errorMessage(res, 400, wishlistResponseMsg.addToWishlist.failedMsg);
            }
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const getWishlist = async (req: Request, res: Response) => {
    try {
        const userId: string = res.locals.jwt.userId;
        // if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, "Please login !");

        var getPage: any = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page) {
            page = 1;
        }
        var page_size: any = config.pageSize;
        const offset = (page - 1) * page_size;

        const getPageQuery = `SELECT wishlist.product_id, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN wishlist on wishlist.product_id = products.product_id LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE wishlist.user_id = ${userId} GROUP BY products.product_id`;
        const [result]: any = await pool.query(getPageQuery);

        const wishlistQuery = `SELECT wishlist.product_id, products.name, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating, wishlist.created_at FROM products LEFT JOIN wishlist on wishlist.product_id = products.product_id LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE wishlist.user_id = ${userId} GROUP BY products.product_id ORDER BY created_at desc limit ${page_size} offset ${offset}`;
        const [rows]: any = await pool.query(wishlistQuery);

        const cartQuery = `SELECT product_id FROM cart_details WHERE user_id = ${userId}`;
        const [cartRows]: any = await pool.query(cartQuery);
        if (rows.length > 0) {
            let productIdsArr: any = [];

            rows.forEach((element: any, index: any) => {
                let productId = element.product_id;
                productIdsArr.push(productId);

                if (cartRows.length === 0) {
                    rows[index].isAddedToCart = false;
                }
                for (const cartData of cartRows) {
                    if (cartData.product_id === element.product_id) {
                        rows[index].isAddedToCart = true;
                        break;
                    } else {
                        rows[index].isAddedToCart = false;
                    }
                }
            });

            const productImageSql = `SELECT product_id, image FROM product_image WHERE product_id IN(${productIdsArr})`;
            const [productImageRows]: any = await pool.query(productImageSql);

            let rowIndex = -1
            let imageDataIndex = -1;
            for (const element of rows) {
                rowIndex++;
                rows[rowIndex].productImg = []

                for (const imgEle of productImageRows) {
                    imageDataIndex++;
                    if (element.product_id === imgEle.product_id) {
                        (rows[rowIndex].productImg).push(imgEle.image);
                    }
                }
            }

            let totalPages: any = result.length / page_size;
            let totalPage = Math.ceil(totalPages);

            return res.status(200).json({
                status: true,
                data: rows,
                totalPage: totalPage,
                currentPage: page,
                totalLength: result.length,
                message: wishlistResponseMsg.getWishlist.successMsg
            })
        } else {
            return apiResponse.successResponse(res, wishlistResponseMsg.getWishlist.noDataFoundMsg, null);
        }

    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const removeFromWishlist = async (req: Request, res: Response) => {
    try {
        const userId: string = res.locals.jwt.userId;
        const productId = req.query.productId;
        if (!productId || productId === "" || productId === undefined) return apiResponse.errorMessage(res, 400, wishlistResponseMsg.removeFromWishlist.nullProductIdMsg);

        const sql = `DELETE FROM wishlist WHERE user_id = ${userId} AND product_id = ${productId}`;
        const [rows]: any = await pool.query(sql);

        return apiResponse.successResponse(res, wishlistResponseMsg.removeFromWishlist.successMsg, null)
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================
