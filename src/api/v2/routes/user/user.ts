import {Router} from "express";

import * as registerController from '../../controller/user/register';
import * as userController from '../../controller/user/login';
import * as forgotPasswordController from '../../controller/user/forgotPassword';
import * as changePassword from '../../controller/user/changePassword';
import  * as checkUserName from'../../controller/user/checkUserName';
import  * as countryListController from '../../controller/user/countryList';
import * as settingController from '../../controller/user/setting';
import * as deleteAccountController from '../../controller/user/deleteAccount';

import {authenticatingToken} from '../../middleware/authorization.controller';
import * as validation from '../../middleware/validation';

const authRouter = Router();

authRouter.post('/register', validation.registrationValidation, registerController.register);
authRouter.post('/socialRegister', validation.socialRegistrationValidation, registerController.socialRegister);
authRouter.post('/login', validation.loginValidation, userController.login);
authRouter.post('/socialLogin', validation.socialLoginValidation, userController.socialLogin);
authRouter.post('/forgotPassword', forgotPasswordController.forgotPassword);
authRouter.patch('/changePassword', authenticatingToken, validation.changePasswordValidation, changePassword.changePassword);
authRouter.get('/checkUserName', checkUserName.validUserName);
authRouter.get('/checkEmail', checkUserName.checkEmail);
authRouter.get('/getCountryList', countryListController.countryList);
authRouter.post('/setting', authenticatingToken ,validation.settingValidation, settingController.setting);
authRouter.delete('/deleteAccount', authenticatingToken, deleteAccountController.deleteAccount);

export default authRouter;