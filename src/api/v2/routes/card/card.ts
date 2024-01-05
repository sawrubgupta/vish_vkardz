import {Router} from "express";

import * as productController from '../../controller/card/products';
import * as wishlistContriller from '../../controller/card/wishlist';
import * as cartController from '../../controller/card/cart';
import * as couponCodeController from '../../controller/card/coupons';
import * as purchaseController from '../../controller/card/purchase';
import * as ratingController from '../../controller/card/rating';
// import * as packageController from '../../controller/cart/package';
import * as addressController from '../../controller/card/address';

import {authenticatingToken, tempAuthenticatingToken} from '../../middleware/authorization.controller';
import * as validation from '../../middleware/validation';

const cardRouter = Router();

cardRouter.get("/getCategory", productController.getCategories);
cardRouter.get("/productList", tempAuthenticatingToken, productController.getProductByCategoryId);
cardRouter.get("/productDetail", tempAuthenticatingToken, productController.productDetail);
cardRouter.get("/productsFaq", productController.productFaq);
cardRouter.post("/purchaseCard", authenticatingToken, validation.purchaseValidation, purchaseController.cardPurchase);
// cardRouter.post("/shipping_method", authenticatingToken, validation.purchaseValidation, cartController.shipping);
cardRouter.get("/vkardzProducts", tempAuthenticatingToken, productController.vkardzProducts);

// cardRouter.patch("/updatePackage", authenticatingToken, packageController.updatePackage);
// cardRouter.get("/getPackageList", packageController.getPackage);

cardRouter.post("/addToWishlist", authenticatingToken, wishlistContriller.addToWishlist);
cardRouter.get("/getWishlist", authenticatingToken, wishlistContriller.getWishlist);
cardRouter.delete("/removeFromWishlist", authenticatingToken, wishlistContriller.removeFromWishlist);

cardRouter.post("/addCart", authenticatingToken, validation.cartValidation, cartController.addToCart);
cardRouter.get("/getCart", authenticatingToken, cartController.getCart);
cardRouter.get("/cartCount", authenticatingToken, cartController.cartCount);
cardRouter.delete("/removeFromCart", authenticatingToken, cartController.removeFromCart);
cardRouter.patch("/updateCartQty", authenticatingToken, validation.cartValidation, cartController.updateCartQty);

cardRouter.post("/customizeCard", authenticatingToken, validation.customizeCardValidation, cartController.addCostmizeCard);

cardRouter.post("/addDeliveryAddress", authenticatingToken, validation.deliveryAddressValidation, addressController.addDeliveryAddresess);
cardRouter.patch("/updateDeliveryAddress", authenticatingToken, validation.updateDdeliveryAddressValidation, addressController.updateDeliveryAddresess);
cardRouter.get("/getDeliveryAddress", authenticatingToken, addressController.getDeliveryAddresses);
cardRouter.delete("/deleteAddress", authenticatingToken, addressController.deleteDaliveryAddress);
cardRouter.post("/defaultAddress", authenticatingToken, addressController.defaultAddress);

cardRouter.get("/checkCouponCode", authenticatingToken, couponCodeController.coupnDiscount);
cardRouter.post("/redeemCoupon", authenticatingToken, couponCodeController.couponRedemptions);

cardRouter.post("/productRating", authenticatingToken, validation.productRatingValidation, ratingController.productRating);
cardRouter.get("/productReviews", ratingController.reviewList);
cardRouter.patch("/updateReview", authenticatingToken, validation.productRatingValidation, ratingController.updateProductReviews);

export default cardRouter;

