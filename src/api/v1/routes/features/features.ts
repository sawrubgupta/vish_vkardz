import {Router} from "express";

import * as featureController from '../../controller/features/manageFeature';
import * as aboutUsCotroller from '../../controller/features/aboutUs';
import * as productController from '../../controller/features/products';
import * as gallaryController from '../../controller/features/gallary';
import * as appointmentController from '../../controller/features/appointment';
import * as enquiryController from '../../controller/features/enquiry';
import * as businessHourController from '../../controller/features/businessHour';

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

featureRouter.post("/addBusinessHour", authenticatingToken, validation.businessHourValidation, businessHourController.addBusinessHour);
featureRouter.get("/businessHour", authenticatingToken, businessHourController.businessHourList);

featureRouter.post("/portfolio", authenticatingToken, gallaryController.gallary);
featureRouter.get("/getPortfolio", authenticatingToken, gallaryController.getPortfolio);
featureRouter.delete("/deletePortfolio", authenticatingToken, gallaryController.deleteImage);

featureRouter.get("/getAppointments", authenticatingToken, appointmentController.appointmentList);
featureRouter.delete("/deleteAppointment", authenticatingToken, appointmentController.deleteAppointment);
featureRouter.post("/manageAppointment", authenticatingToken, appointmentController.manageAppointment);

featureRouter.get("/enquiryList", authenticatingToken, enquiryController.enquiryList);
featureRouter.delete("/deleteEnquiry", authenticatingToken, enquiryController.deleteEnquiry);
featureRouter.post("/replyEnquiry", authenticatingToken, enquiryController.replyEnquiry);

export default featureRouter;