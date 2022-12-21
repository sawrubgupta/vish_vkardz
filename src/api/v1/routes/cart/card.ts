import {Router} from "express";

import * as cartController from '../../controller/cart/card';
import * as wishlistContriller from '../../controller/cart/wishlist';
// import * as purchaseController from '../../controller/cart/purchase'
// import * as packageController from '../../controller/cart/package';

import {authenticatingToken} from '../../middleware/authorization.controller';
import * as validation from '../../middleware/validation';

const cardRouter = Router();

cardRouter.get("/getCategory", cartController.getCategories);
cardRouter.get("/productList", cartController.getProductByCategoryId);
// cardRouter.get("/getSingleProduct", cartController.getSingleProduct);
// cardRouter.post("/purchase", authenticatingToken, validation.purchaseValidation, purchaseController.purchase);
// cardRouter.post("/shipping_method", authenticatingToken, validation.purchaseValidation, cartController.shipping);

// cardRouter.patch("/updatePackage", authenticatingToken, packageController.updatePackage);
// cardRouter.get("/getPackageList", packageController.getPackage);

cardRouter.post("/addToWishlist", authenticatingToken, wishlistContriller.addToWishlist);
cardRouter.get("/getWishlist", authenticatingToken, wishlistContriller.getWishlist);
cardRouter.delete("/removeFromWishlist", authenticatingToken, wishlistContriller.removeFromWishlist);

export default cardRouter;

