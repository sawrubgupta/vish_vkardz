import {Router} from "express";

import * as userController from './adminController';

import * as validation from '../../middleware/validation';
import {authenticatingToken, tempAuthenticatingToken} from '../../middleware/authorization.controller';

const authRouter = Router();

authRouter.post('/register', validation.adminRegistrationValidation, userController.register);
authRouter.post('/login', validation.adminLoginValidation, userController.login);
authRouter.post('/forgotPassword', userController.forgotPassword);
authRouter.patch('/changeAdminPassword', tempAuthenticatingToken, validation.ChangeAdminPasswordValidation, userController.changeAdminPassword);
authRouter.patch('/changeUserPassword', tempAuthenticatingToken, validation.ChangeUserPasswordValidation, userController.changeUserPassword);

export default authRouter;
