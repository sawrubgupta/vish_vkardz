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
exports.validatePin = exports.removePin = exports.setPin = void 0;
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const development_1 = __importDefault(require("../../config/development"));
const responseMsg_1 = __importDefault(require("../../config/responseMsg"));
const setSecurityPinResMsg = responseMsg_1.default.profile.setSecurityPin;
//according v2
const setPin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId;
        const type = req.body.type; //type = business, user, null
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.body.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, setSecurityPinResMsg.setPin.nullUserId);
        const { securityPin, profileId } = req.body;
        const sql = `UPDATE users_profile SET set_password = ? WHERE user_id = ? AND id = ?`;
        const VALUES = [securityPin, userId, profileId];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, setSecurityPinResMsg.setPin.successMsg, null);
        }
        else {
            return apiResponse.errorMessage(res, 400, setSecurityPinResMsg.setPin.failedMsg);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.setPin = setPin;
// ====================================================================================================
// ====================================================================================================
//according v2
const removePin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId;
        const type = req.query.type; //type = business, user, null
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.query.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, setSecurityPinResMsg.removePin.nullUserId);
        const profileId = req.query.profileId;
        const sql = `UPDATE users_profile SET set_password = null WHERE user_id = ${userId} AND id = ${profileId}`;
        const [rows] = yield dbV2_1.default.query(sql);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, setSecurityPinResMsg.removePin.successMsg, null);
        }
        else {
            return apiResponse.errorMessage(res, 400, setSecurityPinResMsg.removePin.failedMsg);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.removePin = removePin;
// ====================================================================================================
// ====================================================================================================
const validatePin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, pin } = req.body;
        const sql = `SELECT * FROM users WHERE username = '${username}' LIMIT 1`;
        const [rows] = yield dbV2_1.default.query(sql);
        if (rows.length === 0)
            return apiResponse.errorMessage(res, 400, setSecurityPinResMsg.validatePin.invalidUsername);
        const profileSql = `SELECT set_password FROM users_profile `;
        // if (rows[0].is_password_enable === 0) {
        //     return apiResponse.successResponse(res, "Profile Pin is disabled", null);
        // }
        if (pin == rows[0].set_password) {
            return apiResponse.successResponse(res, setSecurityPinResMsg.validatePin.successMsg, null);
        }
        else {
            return apiResponse.errorMessage(res, 400, setSecurityPinResMsg.validatePin.wrongPinMsg);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.validatePin = validatePin;
// ====================================================================================================
// ====================================================================================================
