import {Router} from "express";

import * as profileController from '../../controller/profile/profile';
import * as setPinController from '../../controller/profile/setSecurityPin';
import * as themeController from '../../controller/profile/theme';
import * as primaryProfileController from '../../controller/profile/primaryProfile';
import * as switchAccountController from '../../controller/profile/privateAccount';
import * as searchController from '../../controller/profile/searchUser';

import {authenticatingToken} from '../../middleware/authorization.controller';
import * as validation from '../../middleware/validation';

const profileRouter = Router();

profileRouter.get("/getProfile", authenticatingToken, profileController.getProfile);
profileRouter.patch("/updateProfile", authenticatingToken, validation.updateProfileValidation, profileController.updateProfile);
profileRouter.patch("/updateImage", authenticatingToken, profileController.updateImage);

profileRouter.post("/setProfilePin", authenticatingToken, validation.setProfilePinValidation, setPinController.setPin);
profileRouter.delete("/removeProfilePin", authenticatingToken, setPinController.removePin);

profileRouter.get("/getLayots", themeController.getLayout);
profileRouter.patch("/updateVcardLayout", authenticatingToken, themeController.updateVcardLayout);

profileRouter.post('/addPrimaryProfile', authenticatingToken, validation.primaryProfileValidation, primaryProfileController.setPrimaryProfile);
profileRouter.get('/getPrimrySites', authenticatingToken, primaryProfileController.getPrimarySite);

profileRouter.post('/switchAccount', authenticatingToken, validation.switchAccountValidation, switchAccountController.switchToPublic);

profileRouter.get('/searchUser', searchController.search);

export default profileRouter;