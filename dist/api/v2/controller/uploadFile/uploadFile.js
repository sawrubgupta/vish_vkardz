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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const authorization_controller_1 = require("../../middleware/authorization.controller");
const apiResponse = __importStar(require("../../helper/apiResponse"));
var destinationPath = "";
var dbImagePath = "";
//not used
exports.storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        let type = req.body.type;
        if (type === "profile") {
            destinationPath = "./public_html/uploads/profile/thumb/";
            dbImagePath = "uploads/profile/thumb/";
        }
        else if (type === "cover_photo") {
            destinationPath = "./public_html/uploads/profile/cover/";
            dbImagePath = "uploads/profile/cover/";
        }
        else if (type === "custom_logo") {
            destinationPath = "./public_html/uploads/custom-logo/";
            dbImagePath = "uploads/custom-logo/";
        }
        else if (type === "aboutus_image") {
            destinationPath = "./public_html/uploads/services/aboutus/";
            dbImagePath = "uploads/services/aboutus/";
        }
        else if (type === "product_image") {
            destinationPath = "./public_html/uploads/services/product/";
            dbImagePath = "uploads/services/product/";
        }
        else if (type === "portfolio") {
            destinationPath = "./public_html/uploads/services/portfolio/";
            dbImagePath = "uploads/services/portfolio/";
        }
        else if (type === "customize_file") {
            destinationPath = "./public_html/uploads/customize_file/";
            dbImagePath = "uploads/customize_file/";
        }
        else {
            destinationPath = "./public_html/uploads/";
            dbImagePath = "uploads/";
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
const uploadRouter = (0, express_1.Router)();
uploadRouter.post('/uploadFile', authorization_controller_1.authenticatingToken, upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        let type = req.body.type;
        if (!file) {
            return apiResponse.errorMessage(res, 400, "Please Upload a file");
        }
        return apiResponse.successResponse(res, "Image uploded Successfully", dbImagePath);
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}));
exports.default = uploadRouter;
// ====================================================================================================
// ====================================================================================================
