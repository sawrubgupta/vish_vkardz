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
exports.mixingData = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const mixingData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const geturls = `SELECT slug, url FROM app_setting WHERE status = 1`;
        const [url] = yield db_1.default.query(geturls);
        const appVersionQuery = `SELECT * FROM app_update LIMIT 1`;
        const [appVersionData] = yield db_1.default.query(appVersionQuery);
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
        // return apiResponse.successResponse(res, "Data Retrieved Successfully", data);\
        return res.status(200).json({
            status: true,
            url, appVersionRows,
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
