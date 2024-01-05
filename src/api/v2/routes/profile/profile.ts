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
import * as multiProfileController from '../../controller/profile/multiProfile';
import * as vcfDownloadController from '../../controller/profile/vcf';

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
profileRouter.post('/primaryProfileLink', authenticatingToken, validation.addPrimaryLinkValidation, primaryProfileController.addPrimaryLink);
profileRouter.get('/getPrimrySites', authenticatingToken, primaryProfileController.getPrimarySite);

profileRouter.post('/switchAccount', authenticatingToken, validation.switchAccountValidation, privateAccountController.switchToPublic);
profileRouter.post('/privateUserProfile', authenticatingToken, validation.privateUserProfileValidation, privateAccountController.privateProfile);

profileRouter.get('/searchUser', searchController.search);

profileRouter.post('/addUpdateVcf', tempAuthenticatingToken, validation.addVcfValidation, vcfController.addCustomField);
profileRouter.delete('/deleteVcf', tempAuthenticatingToken, vcfController.deleteVcf);
profileRouter.get('/getVcf', tempAuthenticatingToken, vcfController.getVcf);

profileRouter.get('/checkProfilePin', vcardProfileController.checkPinEnable);//not used
profileRouter.get('/vcardProfile', vcardProfileController.vcardProfile);//not used

profileRouter.post('/addCustomInfo', authenticatingToken, validation.customUserInfoValidation, customUserInfoController.addUserCustomInfo);
profileRouter.get('/getUserField', authenticatingToken, customUserInfoController.getUserCustomField);
profileRouter.delete('/deleteUserCf', authenticatingToken, customUserInfoController.deleteUsercf);

profileRouter.get('/profileList', authenticatingToken, multiProfileController.profileListing);
profileRouter.get('/profileDetail', authenticatingToken, multiProfileController.profileDetail);
// profileRouter.post('/addProfile', authenticatingToken, validation.addProfileValidation, multiProfileController.addProfile);
// profileRouter.patch('/updateUserProfile', authenticatingToken, validation.updateUserProfileValidation, multiProfileController.updateProfile);
profileRouter.patch('/updateUserProfile', authenticatingToken, validation.addUpdateUserProfileValidation, multiProfileController.addUpdateProfile);
profileRouter.delete('/deleteProfile', authenticatingToken, multiProfileController.deleteProfile);
profileRouter.get('/cardList', tempAuthenticatingToken, multiProfileController.cardList);

profileRouter.get('/vcf', tempAuthenticatingToken, vcfDownloadController.vcf);

export default profileRouter;