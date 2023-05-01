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
const profileController = __importStar(require("../../controller/profile/profile"));
const setPinController = __importStar(require("../../controller/profile/setSecurityPin"));
const themeController = __importStar(require("../../controller/profile/theme"));
const primaryProfileController = __importStar(require("../../controller/profile/primaryProfile"));
const switchAccountController = __importStar(require("../../controller/profile/privateAccount"));
const searchController = __importStar(require("../../controller/profile/searchUser"));
const vcfController = __importStar(require("../../controller/profile/customField"));
const authorization_controller_1 = require("../../middleware/authorization.controller");
const validation = __importStar(require("../../middleware/validation"));
const profileRouter = (0, express_1.Router)();
profileRouter.get("/getProfile", authorization_controller_1.authenticatingToken, profileController.getProfile); //use in business type
profileRouter.patch("/updateProfile", authorization_controller_1.authenticatingToken, validation.updateProfileValidation, profileController.updateProfile); //use in business type
profileRouter.patch("/updateImage", authorization_controller_1.authenticatingToken, profileController.updateImage); //use in business type
profileRouter.post("/setProfilePin", authorization_controller_1.authenticatingToken, validation.setProfilePinValidation, setPinController.setPin);
profileRouter.delete("/removeProfilePin", authorization_controller_1.authenticatingToken, setPinController.removePin);
profileRouter.get("/getLayots", themeController.getLayout);
profileRouter.patch("/updateVcardLayout", authorization_controller_1.authenticatingToken, themeController.updateVcardLayout); //use in business type
profileRouter.post('/addPrimaryProfile', authorization_controller_1.authenticatingToken, validation.primaryProfileValidation, primaryProfileController.setPrimaryProfile);
profileRouter.get('/getPrimrySites', authorization_controller_1.authenticatingToken, primaryProfileController.getPrimarySite);
profileRouter.post('/switchAccount', authorization_controller_1.authenticatingToken, validation.switchAccountValidation, switchAccountController.switchToPublic);
profileRouter.get('/searchUser', searchController.search);
profileRouter.post('/addUpdateVcf', authorization_controller_1.tempAuthenticatingToken, validation.addVcfValidation, vcfController.addCustomField);
profileRouter.delete('/deleteVcf', authorization_controller_1.tempAuthenticatingToken, vcfController.deleteVcf);
profileRouter.get('/getVcf', authorization_controller_1.tempAuthenticatingToken, vcfController.getVcf);
exports.default = profileRouter;
