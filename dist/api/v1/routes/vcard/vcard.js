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
const getSocialLinksController = __importStar(require("../../controller/vcard/getSocialLinks"));
const getVcardProfileController = __importStar(require("../../controller/vcard/getVcardProfile"));
// import * as updateVcardProfileController from '../../controller/vcard/updateVcardProfile';
// import * as viewVcardProfileController from '../../controller/vcard/viewVcardProfile';
// import * as deleteSocialLinkController from '../../controller/vcard/deleteSocialLink';
// import * as updateSocialLinksController from '../../controller/vcard/updateSocialLinks';
const authorization_controller_1 = require("../../middleware/authorization.controller");
const vcardRouter = (0, express_1.Router)();
vcardRouter.post("/activateCard", authorization_controller_1.authenticatingToken, activateCardController.activateCard);
vcardRouter.get("/deactivateCard", authorization_controller_1.authenticatingToken, deactivateCardController.deactivateCard);
vcardRouter.get("/getSocialLinks", authorization_controller_1.authenticatingToken, getSocialLinksController.getSocialLinks);
vcardRouter.get("/getVcardProfile", authorization_controller_1.authenticatingToken, getVcardProfileController.getVcardProfile);
// vcardRouter.patch("/updateVcardProfile", authenticatingToken,  updateVcardProfileController.updateVcardProfile);
// vcardRouter.delete("/deleteSocialLink", authenticatingToken,  deleteSocialLinkController.deleteSocialLink);
// vcardRouter.get("/viewVcardProfile", authenticatingToken, viewVcardProfileController.viewVcardProfile);
// vcardRouter.get("/getSocialQuickSetupLinks", authenticatingToken, getSocialLinksController.getQuickSetupSocialLinks);
// vcardRouter.patch("/updateSocialLinks", authenticatingToken, updateSocialLinksController.updateSocialLinks);
exports.default = vcardRouter;
