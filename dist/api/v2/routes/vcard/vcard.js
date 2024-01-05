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
const activateCardController = __importStar(require("../../controller/vcard/activateCard"));
const deactivateCardController = __importStar(require("../../controller/vcard/deactivateCard"));
const socialLinksController = __importStar(require("../../controller/vcard/socialLinks"));
const getVcardProfileController = __importStar(require("../../controller/vcard/getVcardProfile"));
// import * as updateVcardProfileController from '../../controller/vcard/updateVcardProfile';
// import * as viewVcardProfileController from '../../controller/vcard/viewVcardProfile';
const authorization_controller_1 = require("../../middleware/authorization.controller");
const validation = __importStar(require("../../middleware/validation"));
const vcardRouter = (0, express_1.Router)();
// vcardRouter.post("/activateCard", tempAuthenticatingToken, validation.activateCardValidation, activateCardController.activateCard);//use in business type
vcardRouter.get("/deactivateCard", authorization_controller_1.tempAuthenticatingToken, deactivateCardController.deactivateCard); //use in business type
vcardRouter.get("/getVcardProfile", authorization_controller_1.tempAuthenticatingToken, getVcardProfileController.getVcardProfile); //use in business type
vcardRouter.post("/activateCard", authorization_controller_1.tempAuthenticatingToken, validation.activateCardValidation, activateCardController.multiProfileActivateCard); //use in business type
vcardRouter.post("/removeCard", authorization_controller_1.tempAuthenticatingToken, validation.removeCardValidation, deactivateCardController.removeCard); //use in business type
vcardRouter.get("/getSocialLinks", authorization_controller_1.tempAuthenticatingToken, socialLinksController.getSocialLinks); //use in business type
vcardRouter.post("/addSocialLinks", authorization_controller_1.tempAuthenticatingToken, validation.addSocialLinksValidation, socialLinksController.addSocialLinks); //use in business type
vcardRouter.patch("/updateSocialLinks", authorization_controller_1.tempAuthenticatingToken, validation.editSocialLinksValidation, socialLinksController.updateSocialLinks); //use in business type
vcardRouter.patch("/addUpdateSocialLinks", authorization_controller_1.tempAuthenticatingToken, validation.addUpdateSocialLinksValidation, socialLinksController.addUpdateSocialLinks); //not used //use in business type
vcardRouter.delete("/deleteSocialLink", authorization_controller_1.tempAuthenticatingToken, validation.deleteSocialLinkValidation, socialLinksController.deleteSocialLink); //use in business type
vcardRouter.post("/socialStatus", authorization_controller_1.tempAuthenticatingToken, validation.socialStatusValidation, socialLinksController.socialStatus); //use in business type
// vcardRouter.patch("/updateVcardProfile", authenticatingToken,  updateVcardProfileController.updateVcardProfile);
// vcardRouter.get("/viewVcardProfile", authenticatingToken, viewVcardProfileController.viewVcardProfile);
// vcardRouter.get("/getSocialQuickSetupLinks", authenticatingToken, getSocialLinksController.getQuickSetupSocialLinks);
exports.default = vcardRouter;
