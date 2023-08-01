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
exports.bestSellerProducts = exports.home = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const development_1 = __importDefault(require("../../config/development"));
const home = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = req.query.type;
        const userId = res.locals.jwt.userId;
        const getBannerQuery = `SELECT * FROM dashboard_banner WHERE status = 1`;
        const [bannerData] = yield db_1.default.query(getBannerQuery);
        const profileBanner = bannerData || [];
        const customizeData = {
            redirectUrl: "https://wa.me/916377256382"
        };
        const supportUrl = {
            redirectUrl: "https://wa.me/916377256382"
        };
        if (userId) {
            const getCardQuery = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE products.sub_cat = 'best-seller' AND products.status = 1 GROUP BY product_rating.product_id LIMIT 5`;
            const [bestSellerProductsRows] = yield db_1.default.query(getCardQuery);
            const checkWishlist = `SELECT product_id FROM wishlist WHERE user_id = ${userId}`;
            const [wishlistRows] = yield db_1.default.query(checkWishlist);
            const cartQuery = `SELECT product_id FROM cart_details WHERE user_id = ${userId}`;
            const [cartRows] = yield db_1.default.query(cartQuery);
            const userQuery = `SELECT name, thumb, username FROM users WHERE id = ${userId} LIMIT 1`;
            const [userData] = yield db_1.default.query(userQuery);
            bestSellerProductsRows.forEach((element, index) => {
                if (wishlistRows.length === 0) {
                    bestSellerProductsRows[index].isAddedToWishlist = false;
                }
                for (const i of wishlistRows) {
                    if (i.product_id === element.product_id) {
                        bestSellerProductsRows[index].isAddedToWishlist = true;
                        break;
                    }
                    else {
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
                    }
                    else {
                        bestSellerProductsRows[index].isAddedToCart = false;
                    }
                }
            });
            return res.status(200).json({
                status: true,
                bannerData, bestSellerProductsRows, customizeData, supportUrl, profileBanner,
                userData: userData[0],
                message: "Data Retrieved Successfully"
            });
        }
        else {
            const getCardQuery = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE products.sub_cat = 'best-seller' AND products.status = 1 GROUP BY product_rating.product_id LIMIT 5`;
            const [bestSellerProductsRows] = yield db_1.default.query(getCardQuery);
            bestSellerProductsRows.forEach((element, index) => {
                bestSellerProductsRows[index].isAddedToWishlist = false;
                bestSellerProductsRows[index].isAddedToCart = false;
            });
            const userData = {
                name: "",
                username: "",
                thumb: ""
            };
            return res.status(200).json({
                status: true,
                bannerData, bestSellerProductsRows, customizeData, supportUrl, profileBanner,
                userData: userData,
                message: "Data Retrieved Successfully"
            });
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Somethong went wrong");
    }
});
exports.home = home;
// ====================================================================================================
// ====================================================================================================
const bestSellerProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        var getPage = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page) {
            page = 1;
        }
        var page_size = development_1.default.pageSize;
        const offset = (page - 1) * page_size;
        if (userId) {
            const getPageQuery = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE products.sub_cat = 'best-seller' AND products.status = 1 GROUP BY product_rating.product_id`;
            const [result] = yield db_1.default.query(getPageQuery);
            const getCardQuery = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE products.sub_cat = 'best-seller' AND products.status = 1 GROUP BY product_rating.product_id ORDER BY products.created_at desc limit ${page_size} offset ${offset}`;
            const [bestSellerProductsRows] = yield db_1.default.query(getCardQuery);
            const checkWishlist = `SELECT product_id FROM wishlist WHERE user_id = ${userId}`;
            const [wishlistRows] = yield db_1.default.query(checkWishlist);
            const cartQuery = `SELECT product_id FROM cart_details WHERE user_id = ${userId}`;
            const [cartRows] = yield db_1.default.query(cartQuery);
            bestSellerProductsRows.forEach((element, index) => {
                if (wishlistRows.length === 0) {
                    bestSellerProductsRows[index].isAddedToWishlist = false;
                }
                for (const i of wishlistRows) {
                    if (i.product_id === element.product_id) {
                        bestSellerProductsRows[index].isAddedToWishlist = true;
                        break;
                    }
                    else {
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
                    }
                    else {
                        bestSellerProductsRows[index].isAddedToCart = false;
                    }
                }
            });
            return res.status(200).json({
                status: true,
                bestSellerProductsRows,
                message: "Data Retrieved Successfully"
            });
        }
        else {
            const getCardQuery = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE products.sub_cat = 'best-seller' AND products.status = 1 GROUP BY product_rating.product_id LIMIT 5`;
            const [bestSellerProductsRows] = yield db_1.default.query(getCardQuery);
            bestSellerProductsRows.forEach((element, index) => {
                bestSellerProductsRows[index].isAddedToWishlist = false;
                bestSellerProductsRows[index].isAddedToCart = false;
            });
            return res.status(200).json({
                status: true,
                bestSellerProductsRows,
                message: "Data Retrieved Successfully"
            });
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.bestSellerProducts = bestSellerProducts;
