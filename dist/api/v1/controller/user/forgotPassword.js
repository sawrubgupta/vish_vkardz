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
const apiResponse = __importStar(require("../../helper/apiResponse"));
const db_1 = __importDefault(require("../../../../db"));
const utility = __importStar(require("../../helper/utility"));
const md5_1 = __importDefault(require("md5"));
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const tempPass = utility.randomString(6);
        const hash = (0, md5_1.default)(tempPass);
        if (!email)
            return apiResponse.errorMessage(res, 400, "Email required");
        const emailCheckSql = `SELECT email, id FROM users where email = '${email}' limit 1`;
        const [rows] = yield db_1.default.query(emailCheckSql);
        if (rows.length > 0) {
            const updatePassSql = `Update users Set password = ? where id = ?`;
            const VALUES = [hash, rows[0].id];
            const [updatePassword] = yield db_1.default.query(updatePassSql, VALUES);
            if (updatePassword.affectedRows > 0) {
                const result = yield utility.sendMail(email, "Password Reset", "You have requested a new password here it is: " + tempPass);
                if (result === false)
                    return apiResponse.errorMessage(res, 400, "Failed to send mail");
                return apiResponse.successResponse(res, "Check your mail inbox for new Password", null);
            }
            else {
                return apiResponse.errorMessage(res, 400, "Something Went Wrong, Please Try again later");
            }
        }
        else {
            return apiResponse.errorMessage(res, 400, "Email not registered with us ! ");
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
/*
//use bcrypt
export const forgotPassword =async (req:Request, res:Response) => {
    try {
        const email:string = req.body.email;
        const tempPass:any = utility.randomString(6);
        
        if (!email) return apiResponse.errorMessage(res, 400, "Email required");

        const emailCheckSql = `SELECT email, id FROM users where email = '${email}' limit 1`;
        const [rows]:any = await pool.query(emailCheckSql);

        if (rows.length > 0) {
            bcrypt.hash(tempPass, 10, async (err, hash) => {
                if (err) {
                    return apiResponse.errorMessage(res, 400, "Something Went Wrong, Contact Support!!");
                }
                const updatePassSql = `Update users Set password = ? where id = ?`;
                const VALUES = [hash, rows[0].id]
                const [updatePassword]:any = await pool.query(updatePassSql, VALUES)
                
                if (updatePassword.affectedRows > 0) {
                    await utility.sendMail(email, "Password Reset", "You have requested a new password here it is: " + tempPass);
                    return apiResponse.successResponse(res,"Check your mail inbox for new Password",null );
                } else {
                    return apiResponse.errorMessage(res,400,"Something Went Wrong, Please Try again later");
                }
            })
        } else {
            return apiResponse.errorMessage( res, 400, "Email not registered with us ! ");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong")
    }
}
*/
// ====================================================================================================
// ====================================================================================================
