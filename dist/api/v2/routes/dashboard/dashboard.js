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
const homeController = __importStar(require("../../controller/dashboard/home"));
const mixingDataController = __importStar(require("../../controller/dashboard/mixingData"));
const dealsController = __importStar(require("../../controller/dashboard/deals"));
const contactsController = __importStar(require("../../controller/dashboard/contactSync"));
const tutorialsController = __importStar(require("../../controller/dashboard/tutorials"));
const authorization_controller_1 = require("../../middleware/authorization.controller");
const dashboardRouter = (0, express_1.Router)();
dashboardRouter.get("/home", authorization_controller_1.tempAuthenticatingToken, homeController.home);
dashboardRouter.get("/bestSellerProducts", authorization_controller_1.tempAuthenticatingToken, homeController.bestSellerProducts);
dashboardRouter.get("/mixingData", mixingDataController.mixingData);
dashboardRouter.get("/DealsOfTheDay", dealsController.dealOfTheDay);
dashboardRouter.get("/recommendedProducts", authorization_controller_1.tempAuthenticatingToken, homeController.recommendedProducts); //not used
dashboardRouter.get("/videoTutorials", tutorialsController.tutorials); //not used
dashboardRouter.post("/contactSync", contactsController.contactSync);
dashboardRouter.get("/test", mixingDataController.test);
//for daa transfer only----
// import * as dbDataTransfer from '../../controller/dashboard/dbDataTransfer';
// dashboardRouter.post("/userToUserProfileDataTransfer", authenticatingToken, dbDataTransfer.userToUserProfileDataTransfer);
// dashboardRouter.post("/addUserNewFeature", authenticatingToken, dbDataTransfer.addUserNewFeature);
// dashboardRouter.post("/vcInfoDataAdd", authenticatingToken, dbDataTransfer.vcInfoDataAdd);
// dashboardRouter.post("/cardDataTransfer", authenticatingToken, dbDataTransfer.cardDataTransfer);
exports.default = dashboardRouter;
