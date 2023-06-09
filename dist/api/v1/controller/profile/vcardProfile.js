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
exports.vcardProfile = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const vcardProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.username;
        const getUserQuery = `SELECT * FROM users WHERE id = ${username} LIMIT 1`;
        const [userRows] = yield db_1.default.query(getUserQuery);
        const userId = '';
        if (userRows.length > 0) {
            delete userRows[0].id;
            delete userRows[0].password;
            const getSocialSiteQuery = `SELECT social_sites.id, social_sites.name, social_sites.social_link, social_sites.social_img, social_sites.type, social_sites.status, social_sites.primary_profile, vcard_social_sites.value, vcard_social_sites.label, vcard_social_sites.orders FROM social_sites LEFT JOIN vcard_social_sites ON social_sites.id = vcard_social_sites.site_id AND vcard_social_sites.user_id = ${userId} HAVING vcard_social_sites.value IS NOT NULL ORDER BY vcard_social_sites.value DESC, vcard_social_sites.orders IS NULL ASC LIMIT 6`;
            const [socialRows] = yield db_1.default.query(getSocialSiteQuery);
            const getCardQuery = `SELECT products.slug, products.product_image, products.image_back, products.image_other FROM products LEFT JOIN orderlist ON products.product_id = orderlist.product_id WHERE orderlist.user_id = ${userId}`;
            const [cardData] = yield db_1.default.query(getCardQuery);
            const getThemes = `SELECT users.themes as themeId, vkard_layouts.vkard_style, vkard_layouts.image FROM users LEFT JOIN vkard_layouts ON users.vcard_layouts = vkard_layouts.id WHERE users.id = ${userId} LIMIT 1`;
            const [themeData] = yield db_1.default.query(getThemes);
            const cartSql = `SELECT COUNT(id) AS totalCartItem FROM cart_details WHERE user_id = ${userId}`;
            const [cartRows] = yield db_1.default.query(cartSql);
            const wishlistSql = `SELECT COUNT(id) AS totalWishlistItem FROM wishlist WHERE user_id = ${userId}`;
            const [wishlistRows] = yield db_1.default.query(wishlistSql);
            userRows[0].social_sites = socialRows || [];
            userRows[0].cardData = cardData || [];
            userRows[0].activeTheme = themeData[0] || {};
            userRows[0].totalCartItem = cartRows[0].totalCartItem || 0;
            userRows[0].totalWishlistItem = wishlistRows[0].totalWishlistItem || 0;
            return apiResponse.successResponse(res, "Get user profile data!", userRows[0]);
        }
        else {
            return apiResponse.errorMessage(res, 400, "User not found!");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.vcardProfile = vcardProfile;
// ====================================================================================================
// ====================================================================================================
