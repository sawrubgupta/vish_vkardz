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
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const development_1 = __importDefault(require("../../config/development"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const express_1 = require("express");
const authorization_controller_1 = require("../../middleware/authorization.controller");
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const dbV2_1 = __importDefault(require("../../../../dbV2"));
let bucketName = process.env.BUCKET_NAME;
const credentials = development_1.default.AWS;
var bucketImagePath = "";
let s3 = new aws_sdk_1.default.S3({
    credentials
});
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: bucketName,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
            let type = req.body.type;
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            if (type === "blogs") {
                cb(null, 'uploads/blogs/' + uniqueSuffix + '_' + file.originalname);
            }
            else if (type === "company") {
                cb(null, 'uploads/company_logo/' + uniqueSuffix + '_' + file.originalname);
            }
            else if (type === "about") {
                cb(null, 'uploads/about/' + uniqueSuffix + '_' + file.originalname);
            }
            else if (type === "custom") {
                cb(null, 'uploads/custom-logo/' + uniqueSuffix + '_' + file.originalname);
            }
            else if (type === "customize_file") {
                cb(null, 'uploads/customize_file/' + uniqueSuffix + '_' + file.originalname);
            }
            else if (type === "files") {
                cb(null, 'uploads/files/' + uniqueSuffix + '_' + file.originalname);
            }
            else if (type === "portfolio") {
                cb(null, 'uploads/portfolio/' + uniqueSuffix + '_' + file.originalname);
            }
            else if (type === "profile") {
                cb(null, 'uploads/profile/' + uniqueSuffix + '_' + file.originalname);
            }
            else if (type === "qrcode") {
                cb(null, 'uploads/qrcode/' + uniqueSuffix + '_' + file.originalname);
            }
            else if (type === "rating") {
                cb(null, 'uploads/rating/' + uniqueSuffix + '_' + file.originalname);
            }
            else if (type === "reviews") {
                cb(null, 'uploads/reviews/' + uniqueSuffix + '_' + file.originalname);
            }
            else if (type === "services") {
                cb(null, 'uploads/services/' + uniqueSuffix + '_' + file.originalname);
            }
            else if (type === "cover") {
                cb(null, 'uploads/cover/' + uniqueSuffix + '_' + file.originalname);
            }
            else if (type === "docfile") {
                cb(null, 'uploads/user_docfile/' + uniqueSuffix + '_' + file.originalname);
            }
            else if (type === "vcard") {
                cb(null, 'uploads/vcard/' + uniqueSuffix + '_' + file.originalname);
            }
            else if (type === "video") {
                cb(null, 'uploads/video/' + uniqueSuffix + '_' + file.originalname);
            }
            else if (type === "social") {
                cb(null, 'uploads/social_icon/updated/' + uniqueSuffix + '_' + file.originalname);
            }
            else if (type === "features") {
                cb(null, 'uploads/app-icon/features/' + uniqueSuffix + '_' + file.originalname);
            }
            else if (type === "thumb") {
                cb(null, 'uploads/users/thumb/' + uniqueSuffix + '_' + file.originalname);
            }
            else {
                cb(null, 'uploads/others' + uniqueSuffix + '_' + file.originalname);
            }
            // cb(null, 'vendorImage/'+file.originalname)
        })
    })
});
const uploadBucketRouter = (0, express_1.Router)();
uploadBucketRouter.post('/uploadFile', authorization_controller_1.tempAuthenticatingToken, upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        let type = req.body.type;
        const file = req.file;
        const createdAt = utility.dateWithFormat();
        console.log(type);
        if (!file)
            return apiResponse.errorMessage(res, 400, "Please Upload a file");
        const filePath = (file.location).split("https://vkardz.s3.ap-south-1.amazonaws.com/");
        const sql = `INSERT INTO all_files(user_id, type, url, created_at) VALUES(?, ?, ?, ?)`;
        const VALUES = [userId, type, filePath[1], createdAt];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        return apiResponse.successResponse(res, "Uploded Successfully", filePath[1]);
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
}));
exports.default = uploadBucketRouter;
