import {Router} from "express";

import * as featureController from '../../controller/features/manageFeature';
import * as aboutUsCotroller from '../../controller/features/aboutUs';
import * as productController from '../../controller/features/products';
import * as gallaryController from '../../controller/features/gallary';
import * as appointmentController from '../../controller/features/appointment';
import * as enquiryController from '../../controller/features/enquiry';

import {authenticatingToken} from '../../middleware/authorization.controller';
import * as validation from '../../middleware/validation';

const featureRouter = Router();

featureRouter.get("/getUserFeature", authenticatingToken, featureController.getFeatureByUserId);
featureRouter.patch("/updateFeatures", authenticatingToken, featureController.updateUserFeaturesStatus);

featureRouter.put("/aboutUs", authenticatingToken, validation.aboutUsValidation, aboutUsCotroller.addUpdateAboutUs);
featureRouter.get("/aboutUs", authenticatingToken, aboutUsCotroller.getAboutUs);
featureRouter.delete("/deleteAboutUs", authenticatingToken, aboutUsCotroller.deleteAboutUs);

featureRouter.post("/addProducts", authenticatingToken, validation.userProductsValidation, productController.addProduct);
featureRouter.get("/getProducts", authenticatingToken, productController.getProducts);
featureRouter.patch("/updateProduct", authenticatingToken, validation.userProductsValidation, productController.updateProduct);
featureRouter.delete("/deleteProduct", authenticatingToken, productController.deleteProduct);

featureRouter.post("/portfolio", authenticatingToken, gallaryController.gallary);
featureRouter.get("/getPortfolio", authenticatingToken, gallaryController.getPortfolio);
featureRouter.delete("/deletePortfolio", authenticatingToken, gallaryController.deleteImage);

featureRouter.get("/getAppointments", authenticatingToken, appointmentController.appointmentList);

featureRouter.get("/enquiryList", authenticatingToken, enquiryController.enquiryList);

export default featureRouter;