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
vcardRouter.post("/activateCard", authorization_controller_1.authenticatingToken, activateCardController.activateCard);
vcardRouter.get("/deactivateCard", authorization_controller_1.authenticatingToken, deactivateCardController.deactivateCard);
vcardRouter.get("/getVcardProfile", authorization_controller_1.authenticatingToken, getVcardProfileController.getVcardProfile);
vcardRouter.get("/getSocialLinks", authorization_controller_1.authenticatingToken, socialLinksController.getSocialLinks);
vcardRouter.patch("/updateSocialLinks", authorization_controller_1.authenticatingToken, validation.editSocialLinksValidation, socialLinksController.updateSocialLinks);
vcardRouter.delete("/deleteSocialLink", authorization_controller_1.authenticatingToken, socialLinksController.deleteSocialLink);
// vcardRouter.patch("/updateVcardProfile", authenticatingToken,  updateVcardProfileController.updateVcardProfile);
// vcardRouter.get("/viewVcardProfile", authenticatingToken, viewVcardProfileController.viewVcardProfile);
// vcardRouter.get("/getSocialQuickSetupLinks", authenticatingToken, getSocialLinksController.getQuickSetupSocialLinks);
exports.default = vcardRouter;
