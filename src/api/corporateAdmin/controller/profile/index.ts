import {Router} from "express";

import * as profileController from './profile';

import * as validation from '../../middleware/validation';
import {authenticatingToken, tempAuthenticatingToken} from '../../middleware/authorization.controller';

const profileRouter = Router();

profileRouter.get('/userList', authenticatingToken, profileController.userList);
profileRouter.patch('/updateUserDetail', tempAuthenticatingToken, validation.updateUserDetailValidation, profileController.updateUser);

export default profileRouter;
