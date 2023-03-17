"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registerController = __importStar(require("../../controller/user/register"));
const userController = __importStar(require("../../controller/user/login"));
const forgotPasswordController = __importStar(require("../../controller/user/forgotPassword"));
const changePassword = __importStar(require("../../controller/user/changePassword"));
const checkUserName = __importStar(require("../../controller/user/checkUserName"));
const countryListController = __importStar(require("../../controller/user/countryList"));
const settingController = __importStar(require("../../controller/user/setting"));
// import * as deleteAccountController from '../../controller/user/deleteAccount';
const authorization_controller_1 = require("../../middleware/authorization.controller");
const validation = __importStar(require("../../middleware/validation"));
const authRouter = (0, express_1.Router)();
authRouter.post('/register', validation.registrationValidation, registerController.register);
authRouter.post('/socialRegister', validation.socialRegistrationValidation, registerController.socialRegister);
authRouter.post('/login', validation.loginValidation, userController.login);
authRouter.post('/socialLogin', validation.socialLoginValidation, userController.socialLogin);
authRouter.post('/forgotPassword', forgotPasswordController.forgotPassword);
authRouter.patch('/changePassword', authorization_controller_1.authenticatingToken, validation.changePasswordValidation, changePassword.changePassword);
authRouter.get('/checkUserName', checkUserName.validUserName);
authRouter.get('/checkEmail', checkUserName.checkEmail);
authRouter.get('/getCountryList', countryListController.countryList);
authRouter.post('/setting', authorization_controller_1.authenticatingToken, validation.settingValidation, settingController.setting);
// authRouter.delete('/deleteAccount', rateLimiterUsingThirdParty, authenticatingToken, deleteAccountController.deleteAccount);
exports.default = authRouter;
