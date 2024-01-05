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
exports.apiTest = exports.test = exports.mixingData = void 0;
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const development_1 = __importDefault(require("../../config/development"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const mixingData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const geturls = `SELECT * FROM app_setting WHERE status = 1`;
        const [url] = yield dbV2_1.default.query(geturls);
        const appVersionQuery = `SELECT * FROM app_update LIMIT 1`;
        const [appVersionData] = yield dbV2_1.default.query(appVersionQuery);
        const limitationSql = `SELECT * FROM user_limitations WHERE status = 1`;
        const [limitationRows] = yield dbV2_1.default.query(limitationSql);
        const appVersionRows = {
            android: {
                forceUpdate: appVersionData[0].force_android_update,
                packageName: appVersionData[0].description,
                launchUrl: appVersionData[0].android_url,
                versionName: appVersionData[0].android_version,
                versionCode: appVersionData[0].android_code,
                isRequired: appVersionData[0].is_required,
            },
            ios: {
                forceUpdate: appVersionData[0].force_ios_update,
                packageName: appVersionData[0].description,
                launchUrl: appVersionData[0].ios_url,
                versionName: appVersionData[0].ios_version,
                versionCode: appVersionData[0].ios_code,
                isRequired: appVersionData[0].is_required,
            }
        };
        const limitationData = {
        // product: 50,
        // gallery: 50,
        // profile: 5
        };
        const customUrls = {
            imgUrl: "https://vkardz.s3.ap-south-1.amazonaws.com/",
            siteUrl: development_1.default.vkardUrl
        };
        for (const ele of limitationRows) {
            // if (ele.type === config.productType) limitationData['product'] = ele.limitation;
            // if (ele.type === config.galleryType) limitationData['gallery'] = ele.limitation;
            // if (ele.type === config.profileType) limitationData['profile'] = ele.limitation;
            limitationData[ele.type] = ele.limitation;
            continue;
        }
        const secretKeys = {
            razorPayKey: process.env.RAZORPAY_KEY,
        };
        const imageResolution = {
            "profileImage": {
                "type": "circular",
                "height": 150,
                "width": 150,
                "quality": 50
            },
            "profileCoverImage": {
                "type": "rect",
                "height": 200,
                "width": 750,
                "quality": 50
            },
            "productImage": {
                "type": "rect",
                "height": 500,
                "width": 300,
                "quality": 50
            },
            "galleryImage": {
                "type": "rect",
                "height": 750,
                "width": 750,
                "quality": 50
            },
            "aboutUsCoverImage": {
                "type": "rect",
                "height": 200,
                "width": 750,
                "quality": 50
            },
            "aboutUsProfileImage": {
                "type": "circular",
                "height": 150,
                "width": 150,
                "quality": 50
            }
        };
        // return apiResponse.successResponse(res, "Data Retrieved Successfully", data);\
        return res.status(200).json({
            status: true,
            url, appVersionRows, limitationData, customUrls, secretKeys, imageResolution,
            message: "Data Retrieved Successfully"
        });
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.mixingData = mixingData;
// ====================================================================================================
// ====================================================================================================
const test = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //   const transporter = nodemailer.createTransport({
        //     name: "mail.lookingforjob.co",
        //         host: "mail.lookingforjob.co",
        //         port: 465,
        //         auth: {
        //           user: "mailto:info@lookingforjob.co",
        //           pass: "asd12300"
        //         },
        //   });
        //   const mailOptions = {
        //     from: "mailto:info@lookingforjob.co",
        //     to: email,
        //     name: email,
        //     subject: `${subject}`,
        //     text: `name is ${name} and phoneNumber is ${phone} and message is ${message}`,
        //   };
        var transport = nodemailer_1.default.createTransport({
            // host: "mail.office365.com",
            service: "gmail",
            // port: 465,
            auth: {
                user: "vkardzinfo@gmail.com",
                pass: "cmwp cahr iysd lndl" //"kokvjhmsplezxfva"
            }
        });
        //   console.log("transport ", transport);
        let info = yield transport.sendMail({
            from: "noreply@vkardz.com",
            to: "vishalpathriya9252@gmail.com",
            subject: "subject",
            text: "message", // plain text body
        });
        // result = info.messageId;
        console.log("Message sent: %s", info);
        console.log("Preview URL: %s", nodemailer_1.default.getTestMessageUrl(info));
        //   transporter.sendMail(mailOptions, (error:any, info:any) => {
        // let info = await transporter.sendMail({
        //     from: "noreply@vkardz.com", // sender address
        //     to: "vishalpathriya9252@gmail.com", // list of receivers
        //     subject: "subject", // Subject line
        //     text: "message", // plain text body
        // })
        return res.status(200).json({
            status: true,
            data: null,
            message: "Data Retrieved Successfully"
        });
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.test = test;
// ====================================================================================================
const apiTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Define your API endpoint
        const apiUrl = 'https://api.example.com/data';
        // Function to make the API call
        function makeApiCall() {
            // Use your preferred method for making API calls (e.g., fetch, axios, etc.)
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                // Handle the API response data here
                console.log("api call", data);
            })
                .catch(error => {
                // Handle errors
                console.error('Error making API call:', error);
            });
        }
        // Set up the loop with a 1-second interval
        const intervalId = setInterval(makeApiCall, 1000);
        // You can stop the loop after a certain number of iterations if needed
        // Uncomment the next line and replace 10 with the desired number of iterations
        // setTimeout(() => clearInterval(intervalId), 1000 * 10);
        // Call the function to start the loop
    }
    catch (e) {
        console.log(e);
        return apiResponse.somethingWentWrongMessage;
    }
});
exports.apiTest = apiTest;
// ====================================================================================================
// ====================================================================================================
