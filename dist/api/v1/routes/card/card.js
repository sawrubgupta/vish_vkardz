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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController = __importStar(require("../../controller/card/products"));
const wishlistContriller = __importStar(require("../../controller/card/wishlist"));
const cartController = __importStar(require("../../controller/card/cart"));
const couponCodeController = __importStar(require("../../controller/card/coupons"));
const purchaseController = __importStar(require("../../controller/card/purchase"));
const ratingController = __importStar(require("../../controller/card/rating"));
// import * as packageController from '../../controller/cart/package';
const authorization_controller_1 = require("../../middleware/authorization.controller");
const validation = __importStar(require("../../middleware/validation"));
const cardRouter = (0, express_1.Router)();
cardRouter.get("/getCategory", productController.getCategories);
cardRouter.get("/productList", productController.getProductByCategoryId);
cardRouter.get("/productsFaq", productController.productFaq);
cardRouter.post("/purchaseCard", authorization_controller_1.authenticatingToken, validation.purchaseValidation, purchaseController.cardPurchase);
// cardRouter.post("/shipping_method", authenticatingToken, validation.purchaseValidation, cartController.shipping);
// cardRouter.patch("/updatePackage", authenticatingToken, packageController.updatePackage);
// cardRouter.get("/getPackageList", packageController.getPackage);
cardRouter.post("/addToWishlist", authorization_controller_1.authenticatingToken, wishlistContriller.addToWishlist);
cardRouter.get("/getWishlist", authorization_controller_1.authenticatingToken, wishlistContriller.getWishlist);
cardRouter.delete("/removeFromWishlist", authorization_controller_1.authenticatingToken, wishlistContriller.removeFromWishlist);
cardRouter.post("/addCart", authorization_controller_1.authenticatingToken, validation.cartValidation, cartController.addToCart);
cardRouter.get("/getCart", authorization_controller_1.authenticatingToken, cartController.getCart);
cardRouter.delete("/removeFromCart", authorization_controller_1.authenticatingToken, cartController.removeFromCart);
cardRouter.patch("/updateCartQty", authorization_controller_1.authenticatingToken, validation.cartValidation, cartController.updataCartQty);
cardRouter.post("/customizeCard", authorization_controller_1.authenticatingToken, validation.customizeCardValidation, cartController.addCostmizeCard);
cardRouter.post("/addDeliveryAddress", authorization_controller_1.authenticatingToken, validation.deliveryAddressValidation, cartController.addDeliveryAddresess);
cardRouter.get("/getDeliveryAddress", authorization_controller_1.authenticatingToken, cartController.getDeliveryAddresses);
cardRouter.delete("/deleteAddress", authorization_controller_1.authenticatingToken, cartController.deleteDaliveryAddress);
cardRouter.get("/checkCouponCode", authorization_controller_1.authenticatingToken, couponCodeController.coupnDiscount);
cardRouter.post("/redeemCoupon", authorization_controller_1.authenticatingToken, couponCodeController.couponRedemptions);
cardRouter.post("/productRating", authorization_controller_1.authenticatingToken, validation.productRatingValidation, ratingController.productRating);
cardRouter.get("/productReviews", ratingController.reviewList);
cardRouter.patch("/updateReview", authorization_controller_1.authenticatingToken, validation.productRatingValidation, ratingController.updateProductReviews);
exports.default = cardRouter;
