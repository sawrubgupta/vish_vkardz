import {Router} from "express";

import * as activateCardController from '../../controller/vcard/activateCard';
import * as deactivateCardController from '../../controller/vcard/deactivateCard';
import * as getSocialLinksController from '../../controller/vcard/getSocialLinks';
import * as getVcardProfileController from '../../controller/vcard/getVcardProfile';

// import * as updateVcardProfileController from '../../controller/vcard/updateVcardProfile';
// import * as viewVcardProfileController from '../../controller/vcard/viewVcardProfile';
// import * as deleteSocialLinkController from '../../controller/vcard/deleteSocialLink';
// import * as updateSocialLinksController from '../../controller/vcard/updateSocialLinks';

import {authenticatingToken} from '../../middleware/authorization.controller';
import * as validation from '../../middleware/validation';

const vcardRouter = Router();

vcardRouter.post("/activateCard", authenticatingToken, activateCardController.activateCard);
vcardRouter.get("/deactivateCard", authenticatingToken, deactivateCardController.deactivateCard);
vcardRouter.get("/getSocialLinks", authenticatingToken, getSocialLinksController.getSocialLinks);
vcardRouter.get("/getVcardProfile", authenticatingToken, getVcardProfileController.getVcardProfile);

// vcardRouter.patch("/updateVcardProfile", authenticatingToken,  updateVcardProfileController.updateVcardProfile);
// vcardRouter.delete("/deleteSocialLink", authenticatingToken,  deleteSocialLinkController.deleteSocialLink);
// vcardRouter.get("/viewVcardProfile", authenticatingToken, viewVcardProfileController.viewVcardProfile);
// vcardRouter.get("/getSocialQuickSetupLinks", authenticatingToken, getSocialLinksController.getQuickSetupSocialLinks);

// vcardRouter.patch("/updateSocialLinks", authenticatingToken, updateSocialLinksController.updateSocialLinks);

export default vcardRouter;