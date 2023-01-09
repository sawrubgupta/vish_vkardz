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
const authorization_controller_1 = require("../../middleware/authorization.controller");
const validation = __importStar(require("../../middleware/validation"));
const featureRouter = (0, express_1.Router)();
featureRouter.get("/getUserFeature", authorization_controller_1.authenticatingToken, featureController.getFeatureByUserId);
featureRouter.patch("/updateFeatures", authorization_controller_1.authenticatingToken, featureController.updateUserFeaturesStatus);
featureRouter.put("/aboutUs", authorization_controller_1.authenticatingToken, validation.aboutUsValidation, aboutUsCotroller.addUpdateAboutUs);
featureRouter.get("/aboutUs", authorization_controller_1.authenticatingToken, aboutUsCotroller.getAboutUs);
featureRouter.delete("/deleteAboutUs", authorization_controller_1.authenticatingToken, aboutUsCotroller.deleteAboutUs);
featureRouter.post("/addProducts", authorization_controller_1.authenticatingToken, validation.userProductsValidation, productController.addProduct);
featureRouter.get("/getProducts", authorization_controller_1.authenticatingToken, productController.getProducts);
featureRouter.patch("/updateProduct", authorization_controller_1.authenticatingToken, validation.userProductsValidation, productController.updateProduct);
featureRouter.delete("/deleteProduct", authorization_controller_1.authenticatingToken, productController.deleteProduct);
featureRouter.post("/addBusinessHour", authorization_controller_1.authenticatingToken, validation.businessHourValidation, businessHourController.addBusinessHour);
featureRouter.get("/businessHour", authorization_controller_1.authenticatingToken, businessHourController.businessHourList);
featureRouter.post("/portfolio", authorization_controller_1.authenticatingToken, gallaryController.gallary);
featureRouter.get("/getPortfolio", authorization_controller_1.authenticatingToken, gallaryController.getPortfolio);
featureRouter.delete("/deletePortfolio", authorization_controller_1.authenticatingToken, gallaryController.deleteImage);
featureRouter.get("/getAppointments", authorization_controller_1.authenticatingToken, appointmentController.appointmentList);
featureRouter.get("/enquiryList", authorization_controller_1.authenticatingToken, enquiryController.enquiryList);
exports.default = featureRouter;
