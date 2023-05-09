import {Router} from "express";

import * as profileController from './profile';
import * as exportController from './exportUser';

import * as validation from '../../middleware/validation';
import {authenticatingToken, tempAuthenticatingToken} from '../../middleware/authorization.controller';

const profileRouter = Router();

profileRouter.get('/userList', authenticatingToken, profileController.userList);
profileRouter.patch('/updateUserDetail', tempAuthenticatingToken, validation.updateUserDetailValidation, profileController.updateUser);
profileRouter.patch('/updateAdminDetail', authenticatingToken, validation.updateAdminDetailValidation, profileController.updateUser);

profileRouter.get('/exportUsers', authenticatingToken, exportController.exportUser);

export default profileRouter;
