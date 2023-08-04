import pool from '../../../../db';
import { Request, Response } from "express";
import * as apiResponse from '../../helper/apiResponse';
import config from '../../config/development';
import * as utility from "../../helper/utility";

export const getCategories = async (req: Request, res: Response) => {
    try {
        const sql = `SELECT * FROM product_type WHERE status = 1`;
        const [rows]: any = await pool.query(sql);

        const extraCategory = {
            id: 20,
            name: "Super Hero Card",
            pro_cat_slug: "super-hero",
            image: "uploads/site_images/superhero-cover.png",
            status: 1
        }
        rows.push(extraCategory);

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

export const getProductByCategoryId = async (req: Request, res: Response) => {
    try {
        const categoryId = req.query.categoryId;
        const userId:any = res.locals.jwt.userId;
        const slug = req.query.slug;

        let query;
        if (categoryId && categoryId != null && categoryId != undefined) {
            query = `products.type = ${categoryId}`;
        } else {
            query = `products.sub_cat = '${slug}'`;
        }
        // if (!categoryId) {
        //     return apiResponse.errorMessage(res, 400, "Please Add Category Id");
        // }
        let keyword = req.query.keyword;

        var getPage: any = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page) {
            page = 1;
        }
        var page_size: any = config.pageSize;
        const offset = (page - 1) * page_size;

        if (userId) {
            const getPageQuery = `SELECT products.product_id, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE ${query} AND products.status = 1 AND products.name LIKE '%${keyword}%' GROUP BY products.product_id`;
            const [result]: any = await pool.query(getPageQuery);

            const sql = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE ${query} AND products.status = 1 AND products.name LIKE '%${keyword}%' GROUP BY products.product_id ORDER BY products.created_at desc limit ${page_size} offset ${offset}`;
            const [rows]: any = await pool.query(sql);

            const checkWishlist = `SELECT product_id FROM wishlist WHERE user_id = ${userId}`;
            const [wishlistRows]:any = await pool.query(checkWishlist);

            const cartQuery = `SELECT product_id FROM cart_details WHERE user_id = ${userId}`;
            const [cartRows]:any = await pool.query(cartQuery);

            rows.forEach((element:any, index:any) => {
                if (wishlistRows.length === 0) {
                    rows[index].isAddedToWishlist = false;
                }
                for (const i of wishlistRows) {
                    if (i.product_id === element.product_id) {
                        rows[index].isAddedToWishlist = true;
                        break;
                    } else {
                        rows[index].isAddedToWishlist = false;
                    }
                }

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
                return apiResponse.successResponse(res, "Data not found", null);
            }    

        } else {
            const getPageQuery = `SELECT products.product_id, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE products.type = ${categoryId} AND products.status = 1 AND products.name LIKE '%${keyword}%' GROUP BY products.product_id`;
            const [result]: any = await pool.query(getPageQuery);

            const sql = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE products.type = ${categoryId} AND products.status = 1 AND products.name LIKE '%${keyword}%' GROUP BY products.product_id ORDER BY products.created_at desc limit ${page_size} offset ${offset}`;
            const [rows]: any = await pool.query(sql);

            rows.forEach((element:any, index:any) => {
                rows[index].isAddedToWishlist = false;
                rows[index].isAddedToCart = false;
            });
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
                return apiResponse.successResponse(res, "Data not found", null);
            }
    
    
        }

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const productDetail =async (req:Request, res:Response) => {
    try {
        const userId:any = res.locals.jwt.userId;
        const productId = req.query.productId;
        if (!productId) {
            return apiResponse.errorMessage(res, 400, "Invalid Product Id");
        }

        if (userId) {
            const sql = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE products.product_id = ${productId} GROUP BY products.product_id`;
            const [rows]: any = await pool.query(sql);

            const checkWishlist = `SELECT product_id FROM wishlist WHERE user_id = ${userId}`;
            const [wishlistRows]:any = await pool.query(checkWishlist);

            const cartQuery = `SELECT product_id FROM cart_details WHERE user_id = ${userId}`;
            const [cartRows]:any = await pool.query(cartQuery);

            rows.forEach((element:any, index:any) => {
                if (wishlistRows.length === 0) {
                    rows[index].isAddedToWishlist = false;
                }
                for (const i of wishlistRows) {
                    if (i.product_id === element.product_id) {
                        rows[index].isAddedToWishlist = true;
                        break;
                    } else {
                        rows[index].isAddedToWishlist = false;
                    }
                }

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

            if (rows.length > 0) {
                return apiResponse.successResponse(res, "Products details are here", rows[0]);
            } else {
                return apiResponse.successResponse(res, "Data not found", null);
            }    

        } else {
            const sql = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE products.product_id = ${productId} GROUP BY products.product_id`;
            const [rows]: any = await pool.query(sql);

            rows.forEach((element:any, index:any) => {
                rows[index].isAddedToWishlist = false;
                rows[index].isAddedToCart = false;
            });
    
            if (rows.length > 0) {
                return apiResponse.successResponse(res, "Products details are here", rows[0]);
                return res.status(200).json({
                    status: true,
                    data: rows,
                    message: "Products details are here"
                })
            } else {
                return apiResponse.successResponse(res, "Data not found", null);
            }
    
    
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const productFaq = async (req: Request, res: Response) => {
    try {
        const productId = req.query.productId;
        const sql = `SELECT id, question, description FROM vcard_product_faq WHERE product_id = ${productId}`;
        const [rows]: any = await pool.query(sql);

        if (rows.length > 0) {
            return apiResponse.successResponse(res, "Data Retrieved Successfully", rows);
        } else {
            return apiResponse.successResponse(res, "No data found", null);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
