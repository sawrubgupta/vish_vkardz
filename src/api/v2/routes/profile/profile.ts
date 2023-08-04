import {Router} from "express";

import * as profileController from '../../controller/profile/profile';
import * as setPinController from '../../controller/profile/setSecurityPin';
import * as themeController from '../../controller/profile/theme';
import * as primaryProfileController from '../../controller/profile/primaryProfile';
import * as privateAccountController from '../../controller/profile/privateAccount';
import * as searchController from '../../controller/profile/searchUser';
import * as vcfController from '../../controller/profile/customField';
import * as vcardProfileController from '../../controller/profile/vcardProfile';
import * as customUserInfoController from '../../controller/profile/customField';

import {authenticatingToken, tempAuthenticatingToken} from '../../middleware/authorization.controller';
import * as validation from '../../middleware/validation';

const profileRouter = Router();

profileRouter.get("/getProfile", tempAuthenticatingToken, profileController.getProfile); //use in business type
profileRouter.patch("/updateProfile", tempAuthenticatingToken, validation.updateProfileValidation, profileController.updateProfile); //use in business type
profileRouter.patch("/updateImage", tempAuthenticatingToken, profileController.updateImage); //use in business type
profileRouter.patch("/updateVcardinfo", authenticatingToken, validation.updateVcardinfoValidation, profileController.updateVcardinfo);
profileRouter.get("/userProfile", profileController.vcardProfile); //use in business type

profileRouter.post("/setProfilePin", tempAuthenticatingToken, validation.setProfilePinValidation, setPinController.setPin); //use in business type
profileRouter.delete("/removeProfilePin", tempAuthenticatingToken, setPinController.removePin); //use in business type
profileRouter.post("/validatePin", validation.validatePinValidation, setPinController.validatePin); //use in business type

profileRouter.get("/getLayots", themeController.getLayout);//use in business type
profileRouter.patch("/updateVcardLayout", tempAuthenticatingToken, themeController.updateVcardLayout); //use in business type

profileRouter.post('/addPrimaryProfile', authenticatingToken, validation.primaryProfileValidation, primaryProfileController.setPrimaryProfile);
profileRouter.get('/getPrimrySites', authenticatingToken, primaryProfileController.getPrimarySite);

profileRouter.post('/switchAccount', authenticatingToken, validation.switchAccountValidation, privateAccountController.switchToPublic);
profileRouter.post('/privateUserProfile', authenticatingToken, validation.privateUserProfileValidation, privateAccountController.privateProfile);

profileRouter.get('/searchUser', searchController.search);

profileRouter.post('/addUpdateVcf', tempAuthenticatingToken, validation.addVcfValidation, vcfController.addCustomField);
profileRouter.delete('/deleteVcf', tempAuthenticatingToken, vcfController.deleteVcf);
profileRouter.get('/getVcf', tempAuthenticatingToken, vcfController.getVcf);

profileRouter.get('/checkProfilePin', vcardProfileController.checkPinEnable);
profileRouter.get('/vcardProfile', vcardProfileController.vcardProfile);

profileRouter.post('/addCustomInfo', authenticatingToken, validation.customUserInfoValidation, customUserInfoController.addUserInfo);
profileRouter.get('/getUserField', authenticatingToken, customUserInfoController.getUserCustomField);
profileRouter.delete('/deleteUserCf', authenticatingToken, customUserInfoController.deleteUsercf);

export default profileRouter;