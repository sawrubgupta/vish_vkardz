import {Router} from "express";

import * as featureController from '../../controller/features/manageFeature';
import * as aboutUsCotroller from '../../controller/features/aboutUs';
import * as productController from '../../controller/features/products';
import * as gallaryController from '../../controller/features/gallary';
import * as appointmentController from '../../controller/features/appointment';
import * as enquiryController from '../../controller/features/enquiry';
import * as businessHourController from '../../controller/features/businessHour';
import * as contactController from '../../controller/features/contacts';
import * as videosController from '../../controller/features/videos';

import {authenticatingToken, tempAuthenticatingToken} from '../../middleware/authorization.controller';
import * as validation from '../../middleware/validation';

const featureRouter = Router();

featureRouter.get("/getUserFeature", tempAuthenticatingToken, featureController.getFeatureByUserId); //use in business type
featureRouter.patch("/updateFeatures", tempAuthenticatingToken, validation.updateFeaturesValidation, featureController.updateUserFeaturesStatus); //use in business type
featureRouter.get("/features", tempAuthenticatingToken, featureController.features); //use in business type

featureRouter.put("/aboutUs", tempAuthenticatingToken, validation.aboutUsValidation, aboutUsCotroller.addUpdateAboutUs); //use in business type
featureRouter.get("/aboutUs", tempAuthenticatingToken, aboutUsCotroller.getAboutUs);//use in business type
featureRouter.delete("/deleteAboutUs", tempAuthenticatingToken, aboutUsCotroller.deleteAboutUs);//use in business type

featureRouter.post("/addProducts", tempAuthenticatingToken, validation.userProductsValidation, productController.addProduct); //use in business type
featureRouter.get("/getProducts", tempAuthenticatingToken, productController.getProducts); //use in business type
featureRouter.patch("/updateProduct", tempAuthenticatingToken, validation.userProductsValidation, productController.updateProduct); //use in business tpe
featureRouter.delete("/deleteProduct", tempAuthenticatingToken, productController.deleteProduct);//use in business type

featureRouter.post("/addBusinessHour", tempAuthenticatingToken, validation.businessHourValidation, businessHourController.addBusinessHour);//use in business type
featureRouter.get("/businessHour", tempAuthenticatingToken, businessHourController.businessHourList);//use in business type

featureRouter.post("/portfolio", tempAuthenticatingToken, gallaryController.gallary); //use in business type
featureRouter.get("/getPortfolio", tempAuthenticatingToken, gallaryController.getPortfolio);//use in business type
featureRouter.delete("/deletePortfolio", tempAuthenticatingToken, gallaryController.deleteImage);//use in business type

featureRouter.get("/getAppointments", tempAuthenticatingToken, appointmentController.appointmentList);//use in business type
featureRouter.delete("/deleteAppointment", tempAuthenticatingToken, appointmentController.deleteAppointment);//use in business type
featureRouter.post("/manageAppointment", tempAuthenticatingToken, validation.manageAppointmentValidation, appointmentController.manageAppointment);//use in business type
featureRouter.post("/bookAppointment", tempAuthenticatingToken, validation.bookAppointmentValidation, appointmentController.bookAppointment);
featureRouter.post("/addTiming", tempAuthenticatingToken, validation.addTimingValidation, appointmentController.addTiming);
featureRouter.patch("/updateTiming", tempAuthenticatingToken, validation.updateTimingValidation, appointmentController.updateTiming);
featureRouter.get("/appointmentTimings", tempAuthenticatingToken, appointmentController.appointmentTimings);
featureRouter.delete("/deleteTiming", tempAuthenticatingToken, appointmentController.deleteAppointmentTiming);

featureRouter.get("/enquiryList", tempAuthenticatingToken, enquiryController.enquiryList); //use in business type
featureRouter.delete("/deleteEnquiry", tempAuthenticatingToken, enquiryController.deleteEnquiry);//use in business type
featureRouter.post("/replyEnquiry", tempAuthenticatingToken, enquiryController.replyEnquiry);//use in business type
featureRouter.post("/enquiry", validation.enquiryValidation, enquiryController.submitEnquiry);//use in business type

featureRouter.post("/exchangeContact", validation.exchangeContactValidation, contactController.exchangeContacts);//use in business type
featureRouter.get("/exchangeContactList", tempAuthenticatingToken, contactController.exchangeContactsList);//use in business type
featureRouter.post("/captureLead", validation.captureLeadtValidation, contactController.captureLead);//use in business type
featureRouter.get("/leads", tempAuthenticatingToken, contactController.leadList);//use in business type

featureRouter.post("/video", tempAuthenticatingToken, validation.videosValidation, videosController.addVideos);
featureRouter.get("/videos", tempAuthenticatingToken, videosController.getVideos);
featureRouter.delete("/deleteVideo", tempAuthenticatingToken, validation.deleteVideosValidation, videosController.deleteVideos);

export default featureRouter;