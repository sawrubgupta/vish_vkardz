import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config from '../../config/development';

export const home =async (req:Request, res:Response) => {
    try {
        const type = req.query.type;
        const userId:any = res.locals.jwt.userId;

        const getBannerQuery = `SELECT * FROM dashboard_banner WHERE type LIKE '%${type}%'`;
        const [bannerData]:any = await pool.query(getBannerQuery);

        const customizeData = {
            redirectUrl: "https://wa.me/916377256382"
        }

        if (userId) {
            const getCardQuery = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE products.sub_cat = 'best-seller' AND products.status = 1 GROUP BY product_rating.product_id LIMIT 5`;
            const [bestSellerProductsRows]:any = await pool.query(getCardQuery);
    
            const checkWishlist = `SELECT product_id FROM wishlist WHERE user_id = ${userId}`;
            const [wishlistRows]:any = await pool.query(checkWishlist);

            const cartQuery = `SELECT product_id FROM cart_details WHERE user_id = ${userId}`;
            const [cartRows]:any = await pool.query(cartQuery);

            const userQuery = `SELECT name, thumb FROM users WHERE id = ${userId} LIMIT 1`;
            const [userData]:any = await pool.query(userQuery);

            bestSellerProductsRows.forEach((element:any, index:any) => {
                if (wishlistRows.length === 0) {
                    bestSellerProductsRows[index].isAddedToWishlist = false;
                }
                for (const i of wishlistRows) {
                    if (i.product_id === element.product_id) {
                        bestSellerProductsRows[index].isAddedToWishlist = true;
                        break;
                    } else {
                        bestSellerProductsRows[index].isAddedToWishlist = false;
                    }
                }

                if (cartRows.length === 0) {
                    bestSellerProductsRows[index].isAddedToCart = false;
                }
                for (const cartData of cartRows) {
                    if (cartData.product_id === element.product_id) {
                        bestSellerProductsRows[index].isAddedToCart = true;
                        break;
                    } else {
                        bestSellerProductsRows[index].isAddedToCart = false;
                    }
                }

            })
            return res.status(200).json({
                status: true,
                bannerData, bestSellerProductsRows, customizeData,
                userData: userData[0],
                message: "Data Retrieved Successfully"
            })
    
        } else {
            const getCardQuery = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE products.sub_cat = 'best-seller' AND products.status = 1 GROUP BY product_rating.product_id LIMIT 5`;
            const [bestSellerProductsRows]:any = await pool.query(getCardQuery);
    
            bestSellerProductsRows.forEach((element:any, index:any) => {
                bestSellerProductsRows[index].isAddedToWishlist = false;
                bestSellerProductsRows[index].isAddedToCart = false;
            });

            const userData = {
                name: "",
                thumb: ""
            }
            return res.status(200).json({
                status: true,
                bannerData, bestSellerProductsRows, customizeData,
                userData: userData,
                message: "Data Retrieved Successfully"
            })
    
        }
    } catch (error) {
        console.log(error);
        return await apiResponse.errorMessage(res, 400, "Somethong went wrong")
    }
}

// ====================================================================================================
// ====================================================================================================

export const bestSellerProducts =async (req:Request, res:Response) => {
    try {
        const userId:any = res.locals.jwt.userId;

        var getPage: any = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page) {
            page = 1;
        }
        var page_size: any = config.pageSize;
        const offset = (page - 1) * page_size;

        if (userId) {
            const getPageQuery = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE products.sub_cat = 'best-seller' AND products.status = 1 GROUP BY product_rating.product_id`
            const [result]: any = await pool.query(getPageQuery);

            const getCardQuery = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE products.sub_cat = 'best-seller' AND products.status = 1 GROUP BY product_rating.product_id ORDER BY products.created_at desc limit ${page_size} offset ${offset}`;
            const [bestSellerProductsRows]:any = await pool.query(getCardQuery);
    
            const checkWishlist = `SELECT product_id FROM wishlist WHERE user_id = ${userId}`;
            const [wishlistRows]:any = await pool.query(checkWishlist);

            const cartQuery = `SELECT product_id FROM cart_details WHERE user_id = ${userId}`;
            const [cartRows]:any = await pool.query(cartQuery);

            bestSellerProductsRows.forEach((element:any, index:any) => {
                if (wishlistRows.length === 0) {
                    bestSellerProductsRows[index].isAddedToWishlist = false;
                }
                for (const i of wishlistRows) {
                    if (i.product_id === element.product_id) {
                        bestSellerProductsRows[index].isAddedToWishlist = true;
                        break;
                    } else {
                        bestSellerProductsRows[index].isAddedToWishlist = false;
                    }
                }

                if (cartRows.length === 0) {
                    bestSellerProductsRows[index].isAddedToCart = false;
                }
                for (const cartData of cartRows) {
                    if (cartData.product_id === element.product_id) {
                        bestSellerProductsRows[index].isAddedToCart = true;
                        break;
                    } else {
                        bestSellerProductsRows[index].isAddedToCart = false;
                    }
                }

            })
            return res.status(200).json({
                status: true,
                bestSellerProductsRows,
                message: "Data Retrieved Successfully"
            })
    
        } else {
            const getCardQuery = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE products.sub_cat = 'best-seller' AND products.status = 1 GROUP BY product_rating.product_id LIMIT 5`;
            const [bestSellerProductsRows]:any = await pool.query(getCardQuery);
    
            bestSellerProductsRows.forEach((element:any, index:any) => {
                bestSellerProductsRows[index].isAddedToWishlist = false;
                bestSellerProductsRows[index].isAddedToCart = false;
            });

            return res.status(200).json({
                status: true,
                bestSellerProductsRows,
                message: "Data Retrieved Successfully"
            })
    
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
}