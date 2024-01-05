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
const privateAccountController = __importStar(require("../../controller/profile/privateAccount"));
const searchController = __importStar(require("../../controller/profile/searchUser"));
const vcfController = __importStar(require("../../controller/profile/customField"));
const vcardProfileController = __importStar(require("../../controller/profile/vcardProfile"));
const customUserInfoController = __importStar(require("../../controller/profile/customField"));
const multiProfileController = __importStar(require("../../controller/profile/multiProfile"));
const vcfDownloadController = __importStar(require("../../controller/profile/vcf"));
const authorization_controller_1 = require("../../middleware/authorization.controller");
const validation = __importStar(require("../../middleware/validation"));
const profileRouter = (0, express_1.Router)();
profileRouter.get("/getProfile", authorization_controller_1.tempAuthenticatingToken, profileController.getProfile); //use in business type
profileRouter.patch("/updateProfile", authorization_controller_1.tempAuthenticatingToken, validation.updateProfileValidation, profileController.updateProfile); //use in business type
profileRouter.patch("/updateImage", authorization_controller_1.tempAuthenticatingToken, profileController.updateImage); //use in business type
profileRouter.patch("/updateVcardinfo", authorization_controller_1.authenticatingToken, validation.updateVcardinfoValidation, profileController.updateVcardinfo);
profileRouter.get("/userProfile", profileController.vcardProfile); //use in business type
profileRouter.post("/setProfilePin", authorization_controller_1.tempAuthenticatingToken, validation.setProfilePinValidation, setPinController.setPin); //use in business type
profileRouter.delete("/removeProfilePin", authorization_controller_1.tempAuthenticatingToken, setPinController.removePin); //use in business type
profileRouter.post("/validatePin", validation.validatePinValidation, setPinController.validatePin); //use in business type
profileRouter.get("/getLayots", themeController.getLayout); //use in business type
profileRouter.patch("/updateVcardLayout", authorization_controller_1.tempAuthenticatingToken, themeController.updateVcardLayout); //use in business type
profileRouter.post('/addPrimaryProfile', authorization_controller_1.authenticatingToken, validation.primaryProfileValidation, primaryProfileController.setPrimaryProfile);
profileRouter.post('/primaryProfileLink', authorization_controller_1.authenticatingToken, validation.addPrimaryLinkValidation, primaryProfileController.addPrimaryLink);
profileRouter.get('/getPrimrySites', authorization_controller_1.authenticatingToken, primaryProfileController.getPrimarySite);
profileRouter.post('/switchAccount', authorization_controller_1.authenticatingToken, validation.switchAccountValidation, privateAccountController.switchToPublic);
profileRouter.post('/privateUserProfile', authorization_controller_1.authenticatingToken, validation.privateUserProfileValidation, privateAccountController.privateProfile);
profileRouter.get('/searchUser', searchController.search);
profileRouter.post('/addUpdateVcf', authorization_controller_1.tempAuthenticatingToken, validation.addVcfValidation, vcfController.addCustomField);
profileRouter.delete('/deleteVcf', authorization_controller_1.tempAuthenticatingToken, vcfController.deleteVcf);
profileRouter.get('/getVcf', authorization_controller_1.tempAuthenticatingToken, vcfController.getVcf);
profileRouter.get('/checkProfilePin', vcardProfileController.checkPinEnable); //not used
profileRouter.get('/vcardProfile', vcardProfileController.vcardProfile); //not used
profileRouter.post('/addCustomInfo', authorization_controller_1.authenticatingToken, validation.customUserInfoValidation, customUserInfoController.addUserCustomInfo);
profileRouter.get('/getUserField', authorization_controller_1.authenticatingToken, customUserInfoController.getUserCustomField);
profileRouter.delete('/deleteUserCf', authorization_controller_1.authenticatingToken, customUserInfoController.deleteUsercf);
profileRouter.get('/profileList', authorization_controller_1.authenticatingToken, multiProfileController.profileListing);
profileRouter.get('/profileDetail', authorization_controller_1.authenticatingToken, multiProfileController.profileDetail);
// profileRouter.post('/addProfile', authenticatingToken, validation.addProfileValidation, multiProfileController.addProfile);
// profileRouter.patch('/updateUserProfile', authenticatingToken, validation.updateUserProfileValidation, multiProfileController.updateProfile);
profileRouter.patch('/updateUserProfile', authorization_controller_1.authenticatingToken, validation.addUpdateUserProfileValidation, multiProfileController.addUpdateProfile);
profileRouter.delete('/deleteProfile', authorization_controller_1.authenticatingToken, multiProfileController.deleteProfile);
profileRouter.get('/cardList', authorization_controller_1.tempAuthenticatingToken, multiProfileController.cardList);
profileRouter.get('/vcf', authorization_controller_1.tempAuthenticatingToken, vcfDownloadController.vcf);
exports.default = profileRouter;
