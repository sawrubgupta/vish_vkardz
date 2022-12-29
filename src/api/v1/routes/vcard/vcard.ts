import {Router} from "express";

import * as activateCardController from '../../controller/vcard/activateCard';
import * as deactivateCardController from '../../controller/vcard/deactivateCard';
import * as socialLinksController from '../../controller/vcard/socialLinks';
import * as getVcardProfileController from '../../controller/vcard/getVcardProfile';

// import * as updateVcardProfileController from '../../controller/vcard/updateVcardProfile';
// import * as viewVcardProfileController from '../../controller/vcard/viewVcardProfile';

import {authenticatingToken} from '../../middleware/authorization.controller';
import * as validation from '../../middleware/validation';

const vcardRouter = Router();

vcardRouter.post("/activateCard", authenticatingToken, activateCardController.activateCard);
vcardRouter.get("/deactivateCard", authenticatingToken, deactivateCardController.deactivateCard);
vcardRouter.get("/getVcardProfile", authenticatingToken, getVcardProfileController.getVcardProfile);
vcardRouter.get("/getSocialLinks", authenticatingToken, socialLinksController.getSocialLinks);
vcardRouter.patch("/updateSocialLinks", authenticatingToken, validation.editSocialLinksValidation, socialLinksController.updateSocialLinks);
vcardRouter.delete("/deleteSocialLink", authenticatingToken, socialLinksController.deleteSocialLink);

// vcardRouter.patch("/updateVcardProfile", authenticatingToken,  updateVcardProfileController.updateVcardProfile);
// vcardRouter.get("/viewVcardProfile", authenticatingToken, viewVcardProfileController.viewVcardProfile);
// vcardRouter.get("/getSocialQuickSetupLinks", authenticatingToken, getSocialLinksController.getQuickSetupSocialLinks);

export default vcardRouter;