import {Router} from "express";

import * as userController from './adminController';

import * as validation from '../../middleware/validation';
import {authenticatingToken} from '../../middleware/authorization.controller';

const authRouter = Router();

authRouter.post('/register', validation.adminRegistrationValidation, userController.register);
authRouter.post('/login', validation.adminLoginValidation, userController.login);
authRouter.post('/forgotPassword', userController.forgotPassword);
authRouter.patch('/changePassword', authenticatingToken, validation.adminChangePasswordValidation, userController.changePassword);

export default authRouter;
