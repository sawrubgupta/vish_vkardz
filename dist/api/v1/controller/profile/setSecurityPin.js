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
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const development_1 = __importDefault(require("../../config/development"));
const setPin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "User Id is required!");
        }
        const isPasswordEnable = req.body.isPasswordEnable;
        const securityPin = req.body.securityPin;
        const sql = `UPDATE users SET is_password_enable = ?, set_password = ? WHERE id = ?`;
        const VALUES = [isPasswordEnable, securityPin, userId];
        const [rows] = yield db_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Profile Password Added Successfully", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to add profle password");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.setPin = setPin;
// ====================================================================================================
// ====================================================================================================
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
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "User Id is required!");
        }
        const sql = `UPDATE users SET is_password_enable = 0 WHERE id = ${userId}`;
        const [rows] = yield db_1.default.query(sql);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Profile Pin Remove Successfully", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to remove security pin, try again later");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.removePin = removePin;
// ====================================================================================================
// ====================================================================================================
const validatePin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, pin } = req.body;
        const sql = `SELECT * FROM users WHERE username = '${username}' LIMIT 1`;
        const [rows] = yield db_1.default.query(sql);
        if (rows.length === 0)
            return apiResponse.errorMessage(res, 400, "Invalid username");
        if (rows[0].is_password_enable === 0) {
            return apiResponse.successResponse(res, "Profile Pin is disabled", null);
        }
        if (pin == rows[0].set_password) {
            return apiResponse.successResponse(res, "Profile pin verified", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Wrong profile pin");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.validatePin = validatePin;
// ====================================================================================================
// ====================================================================================================
