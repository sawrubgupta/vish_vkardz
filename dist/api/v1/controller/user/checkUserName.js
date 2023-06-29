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
exports.checkEmail = exports.validUserName = void 0;
const db_1 = __importDefault(require("../../../../db"));
const utility = __importStar(require("../../helper/utility"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const validUserName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.query.username;
        const englishCheck = utility.englishCheck(username);
        if (englishCheck != "") {
            return apiResponse.errorMessage(res, 400, englishCheck);
        }
        if (!username) {
            return apiResponse.errorMessage(res, 400, "Enter Valid UserName.");
        }
        const checkUserNameQuery = `Select username from users where username = '${username}' limit 1`;
        const [rows] = yield db_1.default.query(checkUserNameQuery);
        if (rows.length > 0) {
            return apiResponse.errorMessage(res, 400, "Username is not available !");
        }
        else {
            return apiResponse.successResponse(res, "Username is available!", null);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.validUserName = validUserName;
// ====================================================================================================
// ====================================================================================================
const checkEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.query.email;
        let emailExist;
        if (!email || email === null) {
            return apiResponse.errorMessage(res, 400, "Enter Valid Email.");
        }
        const checkEmailQuery = `Select email from users where email = '${email}' AND deleted_at IS NULL limit 1`;
        const [rows] = yield db_1.default.query(checkEmailQuery);
        if (rows.length > 0) {
            emailExist = 1;
            return apiResponse.successResponse(res, "Email Id already exist!", emailExist);
        }
        else {
            emailExist = 0;
            return apiResponse.successResponse(res, "Email Id Not Registered!", emailExist);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.checkEmail = checkEmail;
// ====================================================================================================
// ====================================================================================================
