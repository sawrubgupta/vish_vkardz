import {Router} from "express";

import * as profileController from './profile';
import * as exportController from './exportUser';

import * as validation from '../../middleware/validation';
import {authenticatingToken, tempAuthenticatingToken} from '../../middleware/authorization.controller';

const profileRouter = Router();

profileRouter.get('/userList', authenticatingToken, profileController.userList);
profileRouter.patch('/updateUserDetail', tempAuthenticatingToken, validation.updateUserDetailValidation, profileController.updateUser);
profileRouter.patch('/updateUserDisplayField', tempAuthenticatingToken, validation.updateUserDisplayFieldValidation, profileController.updateUserDisplayField);
profileRouter.patch('/updateAdminDetail', authenticatingToken, validation.updateAdminDetailValidation, profileController.updateAdmin);
profileRouter.get('/adminProfile', authenticatingToken, profileController.adminProfile);

profileRouter.get('/exportUsers', authenticatingToken, exportController.exportUser);

export default profileRouter;
