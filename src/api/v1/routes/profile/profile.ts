import {Router} from "express";

import * as profileController from '../../controller/profile/profile';
import * as setPinController from '../../controller/profile/setSecurityPin';
import * as themeController from '../../controller/profile/theme';
import * as primaryProfileController from '../../controller/profile/primaryProfile';
import * as switchAccountController from '../../controller/profile/privateAccount';
import * as searchController from '../../controller/profile/searchUser';
import * as vcfController from '../../controller/profile/customField';

import {authenticatingToken, tempAuthenticatingToken} from '../../middleware/authorization.controller';
import * as validation from '../../middleware/validation';

const profileRouter = Router();

profileRouter.get("/getProfile", tempAuthenticatingToken, profileController.getProfile); //use in business type
profileRouter.patch("/updateProfile", tempAuthenticatingToken, validation.updateProfileValidation, profileController.updateProfile); //use in business type
profileRouter.patch("/updateImage", tempAuthenticatingToken, profileController.updateImage); //use in business type

profileRouter.post("/setProfilePin", authenticatingToken, validation.setProfilePinValidation, setPinController.setPin);
profileRouter.delete("/removeProfilePin", authenticatingToken, setPinController.removePin);

profileRouter.get("/getLayots", themeController.getLayout);
profileRouter.patch("/updateVcardLayout", tempAuthenticatingToken, themeController.updateVcardLayout); //use in business type

profileRouter.post('/addPrimaryProfile', authenticatingToken, validation.primaryProfileValidation, primaryProfileController.setPrimaryProfile);
profileRouter.get('/getPrimrySites', authenticatingToken, primaryProfileController.getPrimarySite);

profileRouter.post('/switchAccount', authenticatingToken, validation.switchAccountValidation, switchAccountController.switchToPublic);
profileRouter.get('/searchUser', searchController.search);

profileRouter.post('/addUpdateVcf', tempAuthenticatingToken, validation.addVcfValidation, vcfController.addCustomField);
profileRouter.delete('/deleteVcf', tempAuthenticatingToken, vcfController.deleteVcf);
profileRouter.get('/getVcf', tempAuthenticatingToken, vcfController.getVcf);

export default profileRouter;