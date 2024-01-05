"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vkardzProducts = exports.productFaq = exports.productDetail = exports.getProductByCategoryId = exports.getCategories = void 0;
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const development_1 = __importDefault(require("../../config/development"));
const responseMsg_1 = __importDefault(require("../../config/responseMsg"));
const productResponseMsg = responseMsg_1.default.card.products;
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = `SELECT * FROM product_type WHERE status = 1`;
        const [rows] = yield dbV2_1.default.query(sql);
        // const extraCategory = {
        //     id: 19,
        //     name: "Other NFC Product",
        //     pro_cat_slug: "other-product",
        //     image: "https://cdn.pixabay.com/photo/2020/05/25/17/21/link-5219567_960_720.jpg",
        //     status: 1
        // }
        // rows.push(extraCategory);
        if (rows.length > 0) {
            return apiResponse.successResponse(res, productResponseMsg.getCategories.successMsg, rows);
        }
        else {
            return apiResponse.successResponse(res, productResponseMsg.getCategories.noDataFoundMsg, null);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.getCategories = getCategories;
// ====================================================================================================
// ====================================================================================================
const getProductByCategoryId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = req.query.categoryId;
        const userId = res.locals.jwt.userId;
        if (!categoryId)
            return apiResponse.errorMessage(res, 400, productResponseMsg.getProductByCategoryId.nullCategoryId);
        let keyword = req.query.keyword;
        var getPage = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page) {
            page = 1;
        }
        var page_size = development_1.default.pageSize;
        const offset = (page - 1) * page_size;
        if (userId) {
            const getPageQuery = `SELECT products.product_id, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE products.type = ${categoryId} AND products.status = 1 AND products.name LIKE '%${keyword}%' GROUP BY products.product_id`;
            const [result] = yield dbV2_1.default.query(getPageQuery);
            const sql = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, products.meta_title, products.meta_description, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE products.type = ${categoryId} AND products.status = 1 AND products.name LIKE '%${keyword}%' GROUP BY products.product_id ORDER BY products.product_id asc limit ${page_size} offset ${offset}`;
            const [rows] = yield dbV2_1.default.query(sql);
            const checkWishlist = `SELECT product_id FROM wishlist WHERE user_id = ${userId}`;
            const [wishlistRows] = yield dbV2_1.default.query(checkWishlist);
            const cartQuery = `SELECT product_id FROM cart_details WHERE user_id = ${userId}`;
            const [cartRows] = yield dbV2_1.default.query(cartQuery);
            if (rows.length > 0) {
                let productIdsArr = [];
                let index = -1;
                // rows.forEach((element: any, index: any) => {
                for (const element of rows) {
                    index++;
                    let productId = element.product_id;
                    productIdsArr.push(productId);
                    if (wishlistRows.length === 0) {
                        rows[index].isAddedToWishlist = false;
                    }
                    for (const i of wishlistRows) {
                        if (i.product_id === element.product_id) {
                            rows[index].isAddedToWishlist = true;
                            break;
                        }
                        else {
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
                        }
                        else {
                            rows[index].isAddedToCart = false;
                        }
                    }
                }
                ;
                const productImageSql = `SELECT product_id, image FROM product_image WHERE product_id IN(${productIdsArr})`;
                const [productImageRows] = yield dbV2_1.default.query(productImageSql);
                let rowIndex = -1;
                let imageDataIndex = -1;
                for (const element of rows) {
                    rowIndex++;
                    rows[rowIndex].productImg = [];
                    for (const imgEle of productImageRows) {
                        imageDataIndex++;
                        if (element.product_id === imgEle.product_id) {
                            (rows[rowIndex].productImg).push(imgEle.image);
                        }
                    }
                }
                let totalPages = result.length / page_size;
                let totalPage = Math.ceil(totalPages);
                // return apiResponse.successResponse(res, "Products details are here", rows);
                return res.status(200).json({
                    status: true,
                    data: rows,
                    totalPage: totalPage,
                    currentPage: page,
                    totalLength: result.length,
                    message: productResponseMsg.getProductByCategoryId.successMsg
                });
            }
            else {
                return apiResponse.successResponse(res, productResponseMsg.getProductByCategoryId.noDataFoundMsg, null);
            }
        }
        else {
            const getPageQuery = `SELECT products.product_id, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE products.type = ${categoryId} AND products.status = 1 AND products.name LIKE '%${keyword}%' GROUP BY products.product_id`;
            const [result] = yield dbV2_1.default.query(getPageQuery);
            const sql = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, products.meta_title, products.meta_description, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE products.type = ${categoryId} AND products.status = 1 AND products.name LIKE '%${keyword}%' GROUP BY products.product_id ORDER BY products.product_id asc limit ${page_size} offset ${offset}`;
            const [rows] = yield dbV2_1.default.query(sql);
            if (rows.length > 0) {
                let productIdsArr = [];
                rows.forEach((element, index) => {
                    let productId = element.product_id;
                    productIdsArr.push(productId);
                    rows[index].isAddedToWishlist = false;
                    rows[index].isAddedToCart = false;
                });
                let totalPages = result.length / page_size;
                let totalPage = Math.ceil(totalPages);
                const productImageSql = `SELECT product_id, image FROM product_image WHERE product_id IN(${productIdsArr})`;
                const [productImageRows] = yield dbV2_1.default.query(productImageSql);
                let rowIndex = -1;
                let imageDataIndex = -1;
                for (const element of rows) {
                    rowIndex++;
                    rows[rowIndex].productImg = [];
                    for (const imgEle of productImageRows) {
                        imageDataIndex++;
                        if (element.product_id === imgEle.product_id) {
                            (rows[rowIndex].productImg).push(imgEle.image);
                        }
                    }
                }
                // return apiResponse.successResponse(res, "Products details are here", rows);
                return res.status(200).json({
                    status: true,
                    data: rows,
                    totalPage: totalPage,
                    currentPage: page,
                    totalLength: result.length,
                    message: productResponseMsg.getProductByCategoryId.successMsg
                });
            }
            else {
                return apiResponse.successResponse(res, productResponseMsg.getProductByCategoryId.noDataFoundMsg, null);
            }
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.getProductByCategoryId = getProductByCategoryId;
// ====================================================================================================
// ====================================================================================================
const productDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const productId = req.query.productId;
        if (!productId)
            return apiResponse.errorMessage(res, 400, productResponseMsg.productDetail.nullProductId);
        if (userId) {
            const sql = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, products.meta_title, products.meta_description, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE (products.product_id = ? || products.slug = ?) GROUP BY products.product_id LIMIT 1`;
            const VALUES = [productId, productId];
            const [rows] = yield dbV2_1.default.query(sql, VALUES);
            if (rows.length > 0) {
                const pId = rows[0].product_id;
                const checkWishlist = `SELECT product_id FROM wishlist WHERE user_id = ${userId} AND product_id = ${pId} LIMIT 1`;
                const [wishlistRows] = yield dbV2_1.default.query(checkWishlist);
                const cartQuery = `SELECT product_id FROM cart_details WHERE user_id = ${userId} AND product_id = ${pId} LIMIT 1`;
                const [cartRows] = yield dbV2_1.default.query(cartQuery);
                const productImageSql = `SELECT product_id, image FROM product_image WHERE product_id = ${pId}`;
                const [productImageRows] = yield dbV2_1.default.query(productImageSql);
                rows[0].productImg = productImageRows;
                if (wishlistRows.length === 0) {
                    rows[0].isAddedToWishlist = false;
                }
                else {
                    if (rows[0].product_id === wishlistRows[0].product_id) {
                        rows[0].isAddedToWishlist = true;
                    }
                    else {
                        rows[0].isAddedToWishlist = false;
                    }
                }
                // rows.forEach((element: any, index: any) => {
                // if (wishlistRows.length === 0) {
                // rows[index].isAddedToWishlist = false;
                // }
                // for (const i of wishlistRows) {
                //     if (i.product_id === element.product_id) {
                //         rows[index].isAddedToWishlist = true;
                //         break;
                //     } else {
                //         rows[index].isAddedToWishlist = false;
                //     }
                // }
                if (cartRows.length === 0) {
                    rows[0].isAddedToCart = false;
                }
                else {
                    if (rows[0].product_id === cartRows[0].product_id) {
                        rows[0].isAddedToCart = true;
                    }
                    else {
                        rows[0].isAddedToCart = false;
                    }
                }
                // if (cartRows.length === 0) {
                //     rows[index].isAddedToCart = false;
                // }
                // for (const cartData of cartRows) {
                //     if (cartData.product_id === element.product_id) {
                //         rows[index].isAddedToCart = true;
                //         break;
                //     } else {
                //         rows[index].isAddedToCart = false;
                //     }
                // }
                // });
                return apiResponse.successResponse(res, productResponseMsg.productDetail.successMsg, rows[0]);
            }
            else {
                return apiResponse.successResponse(res, productResponseMsg.productDetail.noDataFoundMsg, null);
            }
        }
        else {
            const sql = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE (products.product_id = ? || products.slug = ?) GROUP BY products.product_id LIMIT 1`;
            const VALUES = [productId, productId];
            const [rows] = yield dbV2_1.default.query(sql, VALUES);
            if (rows.length > 0) {
                const pId = rows[0].product_id;
                const productImageSql = `SELECT product_id, image FROM product_image WHERE product_id = ${pId}`;
                const [productImageRows] = yield dbV2_1.default.query(productImageSql);
                rows[0].productImg = productImageRows;
                rows[0].isAddedToWishlist = false;
                rows[0].isAddedToCart = false;
                // rows.forEach((element: any, index: any) => {
                //     rows[index].isAddedToWishlist = false;
                //     rows[index].isAddedToCart = false;
                // });
                return apiResponse.successResponse(res, productResponseMsg.productDetail.successMsg, rows[0]);
            }
            else {
                return apiResponse.successResponse(res, productResponseMsg.productDetail.noDataFoundMsg, null);
            }
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.productDetail = productDetail;
// ====================================================================================================
// ====================================================================================================
const productFaq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.query.productId;
        const sql = `SELECT id, question, description FROM vcard_product_faq WHERE product_id = ${productId}`;
        const [rows] = yield dbV2_1.default.query(sql);
        if (rows.length > 0) {
            return apiResponse.successResponse(res, productResponseMsg.productFaq.successMsg, rows);
        }
        else {
            return apiResponse.successResponse(res, productResponseMsg.productFaq.noDataFoundMsg, null);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.productFaq = productFaq;
// ====================================================================================================
// ====================================================================================================
const vkardzProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = `SELECT * FROM vkardz_products WHERE status = 1`;
        const [rows] = yield dbV2_1.default.query(sql);
        if (rows.length) {
            return apiResponse.successResponse(res, "Data retrieved successfully", rows);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Data not found");
        }
    }
    catch (e) {
        console.log(e);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.vkardzProducts = vkardzProducts;
// ====================================================================================================
// ====================================================================================================
