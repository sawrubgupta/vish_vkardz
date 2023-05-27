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
exports.changePassword = void 0;
const apiResponse = __importStar(require("../../helper/apiResponse"));
const db_1 = __importDefault(require("../../../../db"));
const md5_1 = __importDefault(require("md5"));
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const { oldPassword, newPassword } = req.body;
        const hash = (0, md5_1.default)(newPassword);
        const sql = `SELECT password from users WHERE id = ${userId}`;
        const [data] = yield db_1.default.query(sql);
        if (data.length > 0) {
            const oldPassCorrect = (0, md5_1.default)(oldPassword) == data[0].password;
            if (oldPassCorrect) {
                if (oldPassword === newPassword) {
                    return apiResponse.errorMessage(res, 400, "old password and new password can't same");
                }
                const updatePassSql = `Update users Set password = ? where id = ?`;
                const VALUES = [hash, userId];
                const [updatePassword] = yield db_1.default.query(updatePassSql, VALUES);
                if (updatePassword.affectedRows > 0) {
                    return apiResponse.successResponse(res, "Password updated successfully !", null);
                }
                else {
                    return apiResponse.errorMessage(res, 400, "Something Went Wrong, Please Try again later");
                }
            }
            else {
                return apiResponse.errorMessage(res, 400, "Wrong old password !!");
            }
        }
        else {
            return apiResponse.errorMessage(res, 400, "User not found !");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.changePassword = changePassword;
// ====================================================================================================
// ====================================================================================================
/*
//use bcrypt
export const changePassword =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        const {oldPassword, newPassword} = req.body;

        const sql = `SELECT password from users WHERE id = ${userId}`;
        const [data]:any = await pool.query(sql);

        const hashedPassword = data[0].password;
        if (data.length > 0) {
            bcrypt.compare(oldPassword, hashedPassword, async(err, isMatch) => {
                if (err) {
                    return apiResponse.errorMessage(res, 400, "Failed to login, Please try again or Contact support team")
                }
                if (isMatch) {
                    bcrypt.hash(newPassword, 10, async (err, hash) => {
                        if (err) {
                            return apiResponse.errorMessage(res, 400, "Something Went Wrong, Contact Support!!");
                        }
                        const updatePassSql = `Update users Set password = ? where id = ?`;
                        const VALUES = [hash, userId]
                        const [updatePassword]:any = await pool.query(updatePassSql, VALUES)
                        
                        if (updatePassword.affectedRows > 0) {
                            return await apiResponse.successResponse(res,"Password updated successfully !", null);
                        } else {
                            return await apiResponse.errorMessage(res,400,"Something Went Wrong, Please Try again later");
                        }
                    })
                }
                if (!isMatch) {
                    return apiResponse.errorMessage(res, 400, "Wrong old password !!");
                }
            })
        } else{
            return apiResponse.errorMessage(res, 400, "User not found !")
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}
*/
// ====================================================================================================
// ====================================================================================================
