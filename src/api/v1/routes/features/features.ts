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

featureRouter.get("/getUserFeature", authenticatingToken, featureController.getFeatureByUserId); //use in business type
featureRouter.patch("/updateFeatures", authenticatingToken, featureController.updateUserFeaturesStatus); //use in business type

featureRouter.put("/aboutUs", authenticatingToken, validation.aboutUsValidation, aboutUsCotroller.addUpdateAboutUs); //use in business type
featureRouter.get("/aboutUs", authenticatingToken, aboutUsCotroller.getAboutUs);//use in business type
featureRouter.delete("/deleteAboutUs", authenticatingToken, aboutUsCotroller.deleteAboutUs);//use in business type

featureRouter.post("/addProducts", authenticatingToken, validation.userProductsValidation, productController.addProduct); //use in business type
featureRouter.get("/getProducts", authenticatingToken, productController.getProducts); //use in business type
featureRouter.patch("/updateProduct", authenticatingToken, validation.userProductsValidation, productController.updateProduct); //use in business tpe
featureRouter.delete("/deleteProduct", authenticatingToken, productController.deleteProduct);//use in business type

featureRouter.post("/addBusinessHour", authenticatingToken, validation.businessHourValidation, businessHourController.addBusinessHour);//use in business type
featureRouter.get("/businessHour", authenticatingToken, businessHourController.businessHourList);//use in business type

featureRouter.post("/portfolio", authenticatingToken, gallaryController.gallary); //use in business type
featureRouter.get("/getPortfolio", authenticatingToken, gallaryController.getPortfolio);//use in business type
featureRouter.delete("/deletePortfolio", authenticatingToken, gallaryController.deleteImage);//use in business type

featureRouter.get("/getAppointments", authenticatingToken, appointmentController.appointmentList);//use in business type
featureRouter.delete("/deleteAppointment", authenticatingToken, appointmentController.deleteAppointment);//use in business type
featureRouter.post("/manageAppointment", authenticatingToken, appointmentController.manageAppointment);//use in business type

featureRouter.get("/enquiryList", authenticatingToken, enquiryController.enquiryList); //use in business type
featureRouter.delete("/deleteEnquiry", authenticatingToken, enquiryController.deleteEnquiry);//use in business type
featureRouter.post("/replyEnquiry", authenticatingToken, enquiryController.replyEnquiry);//use in business type

export default featureRouter;