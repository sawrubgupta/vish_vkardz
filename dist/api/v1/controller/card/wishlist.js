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
exports.removeFromWishlist = exports.getWishlist = exports.addToWishlist = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const development_1 = __importDefault(require("../../config/development"));
const utility = __importStar(require("../../helper/utility"));
const addToWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !");
        }
        const createdAt = utility.dateWithFormat();
        const productId = req.query.productId;
        if (!productId || productId === "" || productId === undefined) {
            return apiResponse.errorMessage(res, 400, "productId is required!");
        }
        const checkCartPoducts = `SELECT id FROM wishlist WHERE user_id = ${userId} AND product_id = ${productId} limit 1`;
        const [wishlistRows] = yield db_1.default.query(checkCartPoducts);
        if (wishlistRows.length > 0) {
            return apiResponse.errorMessage(res, 400, "Product already added in wishlist!!");
        }
        else {
            const sql = `INSERT INTO wishlist(user_id, product_id, created_at) VALUES(?, ?, ?)`;
            const VALUES = [userId, productId, createdAt];
            const [rows] = yield db_1.default.query(sql, VALUES);
            if (rows.affectedRows > 0) {
                return apiResponse.successResponse(res, "Product added to wishlist", null);
            }
            else {
                return apiResponse.errorMessage(res, 400, "Failed to add product in wishlist, try again");
            }
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.addToWishlist = addToWishlist;
// ====================================================================================================
// ====================================================================================================
const getWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !");
        }
        var getPage = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page) {
            page = 1;
        }
        var page_size = development_1.default.pageSize;
        const offset = (page - 1) * page_size;
        const getPageQuery = `SELECT wishlist.product_id, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN wishlist on wishlist.product_id = products.product_id LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE wishlist.user_id = ${userId} GROUP BY products.product_id`;
        const [result] = yield db_1.default.query(getPageQuery);
        const wishlistQuery = `SELECT wishlist.product_id, products.name, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating, wishlist.created_at FROM products LEFT JOIN wishlist on wishlist.product_id = products.product_id LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE wishlist.user_id = ${userId} GROUP BY products.product_id ORDER BY created_at desc limit ${page_size} offset ${offset}`;
        const [rows] = yield db_1.default.query(wishlistQuery);
        const cartQuery = `SELECT product_id FROM cart_details WHERE user_id = ${userId}`;
        const [cartRows] = yield db_1.default.query(cartQuery);
        rows.forEach((element, index) => {
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
        });
        let totalPages = result.length / page_size;
        let totalPage = Math.ceil(totalPages);
        if (rows.length > 0) {
            return res.status(200).json({
                status: true,
                data: rows,
                totalPage: totalPage,
                currentPage: page,
                totalLength: result.length,
                message: "Wishlist list are here"
            });
        }
        else {
            return apiResponse.successResponse(res, "No data found", null);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.getWishlist = getWishlist;
// ====================================================================================================
// ====================================================================================================
const removeFromWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const productId = req.query.productId;
        if (!productId || productId === "" || productId === undefined) {
            return apiResponse.errorMessage(res, 400, "productId is required!");
        }
        const sql = `DELETE FROM wishlist WHERE user_id = ${userId} AND product_id = ${productId}`;
        const [rows] = yield db_1.default.query(sql);
        return apiResponse.successResponse(res, "Product remove from wishlist", null);
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.removeFromWishlist = removeFromWishlist;
// ====================================================================================================
// ====================================================================================================
