import { Request, Response } from "express";
import pool from '../../../../dbV2';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config from '../../config/development';

export const home = async (req: Request, res: Response) => {
    try {
        const type = req.query.type;
        const userId: any = res.locals.jwt.userId;

        const getBannerQuery = `SELECT * FROM dashboard_banner WHERE status = 1`;
        const [bannerData]: any = await pool.query(getBannerQuery);

        const profileBanner = bannerData || [];

        const customizeData = {
            redirectUrl: "https://wa.me/916377256382"
        }
        const supportUrl = {
            redirectUrl: "https://wa.me/916377256382"
        }

        if (userId) {
            const getCardQuery = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE products.sub_cat = 'best-seller' AND products.status = 1 GROUP BY product_rating.product_id LIMIT 5`;
            const [bestSellerProductsRows]: any = await pool.query(getCardQuery);

            const recommendedProductSql = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE products.is_recommended = 1 AND products.status = 1 GROUP BY product_rating.product_id LIMIT 5`;
            const [recommendedProductRows]: any = await pool.query(recommendedProductSql);

            const checkWishlist = `SELECT product_id FROM wishlist WHERE user_id = ${userId}`;
            const [wishlistRows]: any = await pool.query(checkWishlist);

            const cartQuery = `SELECT product_id FROM cart_details WHERE user_id = ${userId}`;
            const [cartRows]: any = await pool.query(cartQuery);

            const userQuery = `SELECT name, thumb, username FROM users WHERE id = ${userId} LIMIT 1`;
            const [userData]: any = await pool.query(userQuery);

            let productIdsArr: any = [];

            bestSellerProductsRows.forEach((element: any, index: any) => {
                let productId = element.product_id;
                productIdsArr.push(productId);

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
            recommendedProductRows.forEach((element: any, index: any) => {
                let productId = element.product_id;
                productIdsArr.push(productId);

                if (wishlistRows.length === 0) {
                    recommendedProductRows[index].isAddedToWishlist = false;
                }
                for (const i of wishlistRows) {
                    if (i.product_id === element.product_id) {
                        recommendedProductRows[index].isAddedToWishlist = true;
                        break;
                    } else {
                        recommendedProductRows[index].isAddedToWishlist = false;
                    }
                }

                if (cartRows.length === 0) {
                    recommendedProductRows[index].isAddedToCart = false;
                }
                for (const cartData of cartRows) {
                    if (cartData.product_id === element.product_id) {
                        recommendedProductRows[index].isAddedToCart = true;
                        break;
                    } else {
                        recommendedProductRows[index].isAddedToCart = false;
                    }
                }

            })

            const productImageSql = `SELECT product_id, image FROM product_image WHERE product_id IN(${productIdsArr})`;
            const [productImageRows]: any = await pool.query(productImageSql);

            let bestSellerProductsIndex = -1
            let recommendedProductIndex = -1
            let imageDataIndex = -1;

            if (bestSellerProductsRows.length > 0) {
                for (const element of bestSellerProductsRows) {
                    bestSellerProductsIndex++;
                    bestSellerProductsRows[bestSellerProductsIndex].productImg = []
                    for (const imgEle of productImageRows) {
                        imageDataIndex++;

                        if (element.product_id === imgEle.product_id) (bestSellerProductsRows[bestSellerProductsIndex].productImg).push(imgEle.image);

                    }
                }
            }
            if (recommendedProductRows.length > 0) {
                for (const element of recommendedProductRows) {
                    recommendedProductIndex++;
                    recommendedProductRows[recommendedProductIndex].productImg = []
                    for (const imgEle of productImageRows) {
                        imageDataIndex++;

                        if (element.product_id === imgEle.product_id) (recommendedProductRows[recommendedProductIndex].productImg).push(imgEle.image);
                    }
                }
            }

            return res.status(200).json({
                status: true,
                bannerData, bestSellerProductsRows, recommendedProductRows, customizeData, supportUrl, profileBanner,
                userData: userData[0],
                message: "Data Retrieved Successfully"
            })

        } else {
            const getCardQuery = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE products.sub_cat = 'best-seller' AND products.status = 1 GROUP BY product_rating.product_id LIMIT 5`;
            const [bestSellerProductsRows]: any = await pool.query(getCardQuery);

            let productIdsArr: any = [];

            bestSellerProductsRows.forEach((element: any, index: any) => {
                let productId = element.product_id;
                productIdsArr.push(productId);

                bestSellerProductsRows[index].isAddedToWishlist = false;
                bestSellerProductsRows[index].isAddedToCart = false;
            });

            const recommendedProductSql = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE products.is_recommended = 1 AND products.status = 1 GROUP BY product_rating.product_id LIMIT 5`;
            const [recommendedProductRows]: any = await pool.query(recommendedProductSql);

            recommendedProductRows.forEach((element: any, index: any) => {
                let productId = element.product_id;
                productIdsArr.push(productId);

                recommendedProductRows[index].isAddedToWishlist = false;
                recommendedProductRows[index].isAddedToCart = false;
            });

            const userData = {
                name: "",
                username: "",
                thumb: ""
            }

            const productImageSql = `SELECT product_id, image FROM product_image WHERE product_id IN(${productIdsArr})`;
            const [productImageRows]: any = await pool.query(productImageSql);

            let bestSellerProductsIndex = -1
            let recommendedProductIndex = -1
            let imageDataIndex = -1;
            imageDataIndex++;

            if (recommendedProductRows.length > 0) {
                for (const element of bestSellerProductsRows) {
                    bestSellerProductsIndex++;
                    bestSellerProductsRows[bestSellerProductsIndex].productImg = []
                    for (const imgEle of productImageRows) {

                        if (element.product_id === imgEle.product_id) (bestSellerProductsRows[bestSellerProductsIndex].productImg).push(imgEle.image);

                    }
                }
            }
            if (recommendedProductRows.length > 0) {
                for (const element of recommendedProductRows) {
                    bestSellerProductsIndex++;
                    recommendedProductRows[recommendedProductIndex].productImg = []
                    for (const imgEle of productImageRows) {

                        if (element.product_id === imgEle.product_id) (recommendedProductRows[recommendedProductIndex].productImg).push(imgEle.image);
                    }
                }
            }

            return res.status(200).json({
                status: true,
                bannerData, bestSellerProductsRows, recommendedProductRows, customizeData, supportUrl, profileBanner,
                userData: userData,
                message: "Data Retrieved Successfully"
            })
        }

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Somethong went wrong")
    }
}

// ====================================================================================================
// ====================================================================================================

export const bestSellerProducts = async (req: Request, res: Response) => {
    try {
        const userId: any = res.locals.jwt.userId;

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
            const [bestSellerProductsRows]: any = await pool.query(getCardQuery);

            const checkWishlist = `SELECT product_id FROM wishlist WHERE user_id = ${userId}`;
            const [wishlistRows]: any = await pool.query(checkWishlist);

            const cartQuery = `SELECT product_id FROM cart_details WHERE user_id = ${userId}`;
            const [cartRows]: any = await pool.query(cartQuery);

            if (bestSellerProductsRows.length > 0) {

                let productIdsArr: any = [];
                bestSellerProductsRows.forEach((element: any, index: any) => {
                    let productId = element.product_id;
                    productIdsArr.push(productId);

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

                const productImageSql = `SELECT product_id, image FROM product_image WHERE product_id IN(${productIdsArr})`;
                const [productImageRows]: any = await pool.query(productImageSql);

                let rowIndex = -1
                let imageDataIndex = -1;
                for (const element of bestSellerProductsRows) {
                    rowIndex++;
                    bestSellerProductsRows[rowIndex].productImg = []

                    for (const imgEle of productImageRows) {
                        imageDataIndex++;
                        if (element.product_id === imgEle.product_id) {
                            (bestSellerProductsRows[rowIndex].productImg).push(imgEle.image);
                        }
                    }
                }

                return res.status(200).json({
                    status: true,
                    bestSellerProductsRows,
                    message: "Data Retrieved Successfully"
                })
            } else {
                return apiResponse.successResponse(res, "No data found", null);
            }
        } else {
            const getCardQuery = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE products.sub_cat = 'best-seller' AND products.status = 1 GROUP BY product_rating.product_id LIMIT 5`;
            const [bestSellerProductsRows]: any = await pool.query(getCardQuery);

            if (bestSellerProductsRows.length > 0) {
                let productIdsArr: any = [];

                bestSellerProductsRows.forEach((element: any, index: any) => {
                    let productId = element.product_id;
                    productIdsArr.push(productId);

                    bestSellerProductsRows[index].isAddedToWishlist = false;
                    bestSellerProductsRows[index].isAddedToCart = false;
                });

                const productImageSql = `SELECT product_id, image FROM product_image WHERE product_id IN(${productIdsArr})`;
                const [productImageRows]: any = await pool.query(productImageSql);

                let rowIndex = -1
                let imageDataIndex = -1;
                for (const element of bestSellerProductsRows) {
                    rowIndex++;
                    bestSellerProductsRows[rowIndex].productImg = []

                    for (const imgEle of productImageRows) {
                        imageDataIndex++;
                        if (element.product_id === imgEle.product_id) {
                            (bestSellerProductsRows[rowIndex].productImg).push(imgEle.image);
                        }
                    }
                }

                return res.status(200).json({
                    status: true,
                    bestSellerProductsRows,
                    message: "Data Retrieved Successfully"
                })
            } else {
                return apiResponse.successResponse(res, "No data found", null);
            }
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const recommendedProducts = async (req: Request, res: Response) => {
    try {
        const userId: any = res.locals.jwt.userId;

        var getPage: any = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page) {
            page = 1;
        }
        var page_size: any = config.pageSize;
        const offset = (page - 1) * page_size;

        if (userId) {
            const getCardQuery = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE products.is_recommended = 1 AND products.status = 1 GROUP BY product_rating.product_id ORDER BY products.created_at desc limit ${page_size} offset ${offset}`;
            const [recommendedProductRows]: any = await pool.query(getCardQuery);
            if (recommendedProductRows.length > 0) {

                const checkWishlist = `SELECT product_id FROM wishlist WHERE user_id = ${userId}`;
                const [wishlistRows]: any = await pool.query(checkWishlist);

                const cartQuery = `SELECT product_id FROM cart_details WHERE user_id = ${userId}`;
                const [cartRows]: any = await pool.query(cartQuery);

                let productIdsArr: any = [];

                recommendedProductRows.forEach((element: any, index: any) => {
                    let productId = element.product_id;
                    productIdsArr.push(productId);

                    if (wishlistRows.length === 0) {
                        recommendedProductRows[index].isAddedToWishlist = false;
                    }
                    for (const i of wishlistRows) {
                        if (i.product_id === element.product_id) {
                            recommendedProductRows[index].isAddedToWishlist = true;
                            break;
                        } else {
                            recommendedProductRows[index].isAddedToWishlist = false;
                        }
                    }

                    if (cartRows.length === 0) {
                        recommendedProductRows[index].isAddedToCart = false;
                    }
                    for (const cartData of cartRows) {
                        if (cartData.product_id === element.product_id) {
                            recommendedProductRows[index].isAddedToCart = true;
                            break;
                        } else {
                            recommendedProductRows[index].isAddedToCart = false;
                        }
                    }

                })

                const productImageSql = `SELECT product_id, image FROM product_image WHERE product_id IN(${productIdsArr})`;
                const [productImageRows]: any = await pool.query(productImageSql);

                let rowIndex = -1
                let imageDataIndex = -1;
                for (const element of recommendedProductRows) {
                    rowIndex++;
                    recommendedProductRows[rowIndex].productImg = []

                    for (const imgEle of productImageRows) {
                        imageDataIndex++;
                        if (element.product_id === imgEle.product_id) {
                            (recommendedProductRows[rowIndex].productImg).push(imgEle.image);
                        }
                    }
                }

                return res.status(200).json({
                    status: true,
                    recommendedProductRows,
                    message: "Data Retrieved Successfully"
                })

            } else {
                return apiResponse.successResponse(res, "No data found", null);

            }
        } else {
            const getCardQuery = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE products.is_recommended = 1 AND products.status = 1 GROUP BY product_rating.product_id LIMIT 5`;
            const [recommendedProductRows]: any = await pool.query(getCardQuery);
            if (recommendedProductRows.length > 0) {
                let productIdsArr: any = [];

                recommendedProductRows.forEach((element: any, index: any) => {
                    let productId = element.product_id;
                    productIdsArr.push(productId);

                    recommendedProductRows[index].isAddedToWishlist = false;
                    recommendedProductRows[index].isAddedToCart = false;
                });

                const productImageSql = `SELECT product_id, image FROM product_image WHERE product_id IN(${productIdsArr})`;
                const [productImageRows]: any = await pool.query(productImageSql);

                let rowIndex = -1
                let imageDataIndex = -1;
                for (const element of recommendedProductRows) {
                    rowIndex++;
                    recommendedProductRows[rowIndex].productImg = []

                    for (const imgEle of productImageRows) {
                        imageDataIndex++;
                        if (element.product_id === imgEle.product_id) {
                            (recommendedProductRows[rowIndex].productImg).push(imgEle.image);
                        }
                    }
                }

                return res.status(200).json({
                    status: true,
                    recommendedProductRows,
                    message: "Data Retrieved Successfully"
                })
            } else {
                return apiResponse.successResponse(res, "No data found", null);

            }

        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
