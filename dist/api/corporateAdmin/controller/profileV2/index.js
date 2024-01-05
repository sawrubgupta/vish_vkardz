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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
const express_1 = require("express");
const profileController = __importStar(require("./profile"));
const exportController = __importStar(require("./exportUser"));
const validation = __importStar(require("../../middleware/validation"));
const authorization_controller_1 = require("../../middleware/authorization.controller");
const multer_1 = __importDefault(require("multer"));
var destinationPath = "";
var dbImagePath = "";
exports.storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        let type = req.body.type;
        if (type === "add_client") {
            destinationPath = "./public_html/uploads/";
            dbImagePath = "public_html/uploads/";
        }
        else {
            destinationPath = "./public_html/uploads/";
            dbImagePath = "public_html/uploads/";
        }
        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        dbImagePath = dbImagePath + '' + uniqueSuffix + '_' + file.originalname;
        cb(null, uniqueSuffix + '_' + file.originalname);
    }
});
var upload = (0, multer_1.default)({ storage: exports.storage });
const profileRouter = (0, express_1.Router)();
profileRouter.get('/userList', authorization_controller_1.authenticatingToken, profileController.userList);
profileRouter.patch('/updateUserDetail', authorization_controller_1.tempAuthenticatingToken, validation.updateUserDetailValidation, profileController.updateUser);
profileRouter.patch('/updateUserDisplayField', authorization_controller_1.tempAuthenticatingToken, validation.updateUserDisplayFieldValidation, profileController.updateUserDisplayField);
profileRouter.patch('/updateAdminDetail', authorization_controller_1.authenticatingToken, validation.updateAdminDetailValidation, profileController.updateAdmin);
profileRouter.get('/adminProfile', authorization_controller_1.authenticatingToken, profileController.adminProfile);
profileRouter.get('/exportUsers', authorization_controller_1.authenticatingToken, exportController.exportUser);
profileRouter.get('/sampleImportFile', authorization_controller_1.authenticatingToken, exportController.importSampleFile);
profileRouter.post('/importUsers', authorization_controller_1.authenticatingToken, upload.single('file'), exportController.importUser);
exports.default = profileRouter;
