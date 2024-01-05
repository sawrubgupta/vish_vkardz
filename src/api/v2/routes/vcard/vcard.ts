import {Router} from "express";

import * as activateCardController from '../../controller/vcard/activateCard';
import * as deactivateCardController from '../../controller/vcard/deactivateCard';
import * as socialLinksController from '../../controller/vcard/socialLinks';
import * as getVcardProfileController from '../../controller/vcard/getVcardProfile';

// import * as updateVcardProfileController from '../../controller/vcard/updateVcardProfile';
// import * as viewVcardProfileController from '../../controller/vcard/viewVcardProfile';

import {authenticatingToken, tempAuthenticatingToken} from '../../middleware/authorization.controller';
import * as validation from '../../middleware/validation';

const vcardRouter = Router();

// vcardRouter.post("/activateCard", tempAuthenticatingToken, validation.activateCardValidation, activateCardController.activateCard);//use in business type
vcardRouter.get("/deactivateCard", tempAuthenticatingToken, deactivateCardController.deactivateCard);//use in business type
vcardRouter.get("/getVcardProfile", tempAuthenticatingToken, getVcardProfileController.getVcardProfile); //use in business type
vcardRouter.post("/activateCard", tempAuthenticatingToken, validation.activateCardValidation, activateCardController.multiProfileActivateCard);//use in business type
vcardRouter.post("/removeCard", tempAuthenticatingToken, validation.removeCardValidation, deactivateCardController.removeCard);//use in business type

vcardRouter.get("/getSocialLinks", tempAuthenticatingToken, socialLinksController.getSocialLinks); //use in business type
vcardRouter.post("/addSocialLinks", tempAuthenticatingToken, validation.addSocialLinksValidation, socialLinksController.addSocialLinks); //use in business type
vcardRouter.patch("/updateSocialLinks", tempAuthenticatingToken, validation.editSocialLinksValidation, socialLinksController.updateSocialLinks); //use in business type
vcardRouter.patch("/addUpdateSocialLinks", tempAuthenticatingToken, validation.addUpdateSocialLinksValidation, socialLinksController.addUpdateSocialLinks); //not used //use in business type
vcardRouter.delete("/deleteSocialLink", tempAuthenticatingToken, validation.deleteSocialLinkValidation, socialLinksController.deleteSocialLink); //use in business type
vcardRouter.post("/socialStatus", tempAuthenticatingToken, validation.socialStatusValidation, socialLinksController.socialStatus); //use in business type

// vcardRouter.patch("/updateVcardProfile", authenticatingToken,  updateVcardProfileController.updateVcardProfile);
// vcardRouter.get("/viewVcardProfile", authenticatingToken, viewVcardProfileController.viewVcardProfile);
// vcardRouter.get("/getSocialQuickSetupLinks", authenticatingToken, getSocialLinksController.getQuickSetupSocialLinks);

export default vcardRouter;