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
const featureController = __importStar(require("../../controller/features/manageFeature"));
const aboutUsCotroller = __importStar(require("../../controller/features/aboutUs"));
const productController = __importStar(require("../../controller/features/products"));
const gallaryController = __importStar(require("../../controller/features/gallary"));
const appointmentController = __importStar(require("../../controller/features/appointment"));
const enquiryController = __importStar(require("../../controller/features/enquiry"));
const businessHourController = __importStar(require("../../controller/features/businessHour"));
const contactController = __importStar(require("../../controller/features/contacts"));
const videosController = __importStar(require("../../controller/features/videos"));
const authorization_controller_1 = require("../../middleware/authorization.controller");
const validation = __importStar(require("../../middleware/validation"));
const featureRouter = (0, express_1.Router)();
featureRouter.get("/getUserFeature", authorization_controller_1.tempAuthenticatingToken, featureController.getFeatureByUserId); //use in business type
featureRouter.patch("/updateFeatures", authorization_controller_1.tempAuthenticatingToken, featureController.updateUserFeaturesStatus); //use in business type
featureRouter.put("/aboutUs", authorization_controller_1.tempAuthenticatingToken, validation.aboutUsValidation, aboutUsCotroller.addUpdateAboutUs); //use in business type
featureRouter.get("/aboutUs", authorization_controller_1.tempAuthenticatingToken, aboutUsCotroller.getAboutUs); //use in business type
featureRouter.delete("/deleteAboutUs", authorization_controller_1.tempAuthenticatingToken, aboutUsCotroller.deleteAboutUs); //use in business type
featureRouter.post("/addProducts", authorization_controller_1.tempAuthenticatingToken, validation.userProductsValidation, productController.addProduct); //use in business type
featureRouter.get("/getProducts", authorization_controller_1.tempAuthenticatingToken, productController.getProducts); //use in business type
featureRouter.patch("/updateProduct", authorization_controller_1.tempAuthenticatingToken, validation.userProductsValidation, productController.updateProduct); //use in business tpe
featureRouter.delete("/deleteProduct", authorization_controller_1.tempAuthenticatingToken, productController.deleteProduct); //use in business type
featureRouter.post("/addBusinessHour", authorization_controller_1.authenticatingToken, validation.businessHourValidation, businessHourController.addBusinessHour); //use in business type
featureRouter.get("/businessHour", authorization_controller_1.authenticatingToken, businessHourController.businessHourList); //use in business type
featureRouter.post("/portfolio", authorization_controller_1.tempAuthenticatingToken, gallaryController.gallary); //use in business type
featureRouter.get("/getPortfolio", authorization_controller_1.tempAuthenticatingToken, gallaryController.getPortfolio); //use in business type
featureRouter.delete("/deletePortfolio", authorization_controller_1.tempAuthenticatingToken, gallaryController.deleteImage); //use in business type
featureRouter.get("/getAppointments", authorization_controller_1.tempAuthenticatingToken, appointmentController.appointmentList); //use in business type
featureRouter.delete("/deleteAppointment", authorization_controller_1.tempAuthenticatingToken, appointmentController.deleteAppointment); //use in business type
featureRouter.post("/manageAppointment", authorization_controller_1.tempAuthenticatingToken, appointmentController.manageAppointment); //use in business type
featureRouter.post("/bookAppointment", authorization_controller_1.tempAuthenticatingToken, validation.bookAppointmentValidation, appointmentController.bookAppointment);
featureRouter.get("/enquiryList", authorization_controller_1.tempAuthenticatingToken, enquiryController.enquiryList); //use in business type
featureRouter.delete("/deleteEnquiry", authorization_controller_1.tempAuthenticatingToken, enquiryController.deleteEnquiry); //use in business type
featureRouter.post("/replyEnquiry", authorization_controller_1.tempAuthenticatingToken, enquiryController.replyEnquiry); //use in business type
featureRouter.post("/enquiry", validation.enquiryValidation, enquiryController.submitEnquiry); //use in business type
featureRouter.post("/exchangeContact", validation.exchangeContactValidation, contactController.exchangeContacts); //use in business type
featureRouter.post("/captureLead", validation.captureLeadtValidation, contactController.captureLead); //use in business type
featureRouter.post("/video", authorization_controller_1.tempAuthenticatingToken, validation.videosValidation, videosController.addVideos);
featureRouter.get("/videos", authorization_controller_1.tempAuthenticatingToken, videosController.getVideos);
featureRouter.delete("/deleteVideo", authorization_controller_1.tempAuthenticatingToken, validation.deleteVideosValidation, videosController.deleteVideos);
exports.default = featureRouter;
