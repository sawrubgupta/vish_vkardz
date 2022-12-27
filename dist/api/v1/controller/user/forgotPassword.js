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
exports.forgotPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const db_1 = __importDefault(require("../../../../db"));
const utility = __importStar(require("../../helper/utility"));
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const tempPass = utility.randomString(6);
        console.log(tempPass);
        if (!email)
            return yield apiResponse.errorMessage(res, 400, "Email required");
        const emailCheckSql = `SELECT email, id FROM users where email = '${email}' limit 1`;
        const [rows] = yield db_1.default.query(emailCheckSql);
        if (rows.length > 0) {
            bcryptjs_1.default.hash(tempPass, 10, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    return apiResponse.errorMessage(res, 400, "Something Went Wrong, Contact Support!!");
                }
                const updatePassSql = `Update users Set password = ? where id = ?`;
                const VALUES = [hash, rows[0].id];
                const [updatePassword] = yield db_1.default.query(updatePassSql, VALUES);
                if (updatePassword.affectedRows > 0) {
                    yield utility.sendMail(email, "Password Reset", "You have requested a new password here it is: " + tempPass);
                    return yield apiResponse.successResponse(res, "Check your mail inbox for new Password", null);
                }
                else {
                    return yield apiResponse.errorMessage(res, 400, "Something Went Wrong, Please Try again later");
                }
            }));
        }
        else {
            return yield apiResponse.errorMessage(res, 400, "Email not registered with us ! ");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.forgotPassword = forgotPassword;
// ====================================================================================================
// ====================================================================================================
