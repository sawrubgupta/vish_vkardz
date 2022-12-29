import {Router} from "express";

import * as profileController from '../../controller/profile/profile';
import * as setPinController from '../../controller/profile/setSecurityPin';
import * as themeController from '../../controller/profile/theme';

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

export default profileRouter;