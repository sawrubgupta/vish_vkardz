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
exports.changeUserPassword = exports.changeAdminPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
// import config from "../../config/development";
const md5_1 = __importDefault(require("md5"));
const development_1 = __importDefault(require("../../config/development"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, dialCode, password, jobTitle, company, image } = req.body;
        const createdAt = utility.dateWithFormat();
        const hash = (0, md5_1.default)(password);
        const checkDupliSql = `SELECT * FROM business_admin WHERE deleted_at IS NULL AND email = ? LIMIT 1`;
        const dupliVALUES = [email];
        const [dupliRows] = yield dbV2_1.default.query(checkDupliSql, dupliVALUES);
        const dupli = [];
        if (dupliRows.length > 0) {
            if (dupliRows[0].email === email) {
                dupli.push("email");
            }
            else {
                dupli.push("email");
            }
            console.log(dupli);
            const msg = `${dupli.join()} is duplicate, Please change it`;
            return res.status(400).json({
                status: false,
                data: null,
                message: msg,
            });
        }
        const sql = `INSERT INTO business_admin(name, email, phone, dial_code, password, image, job_title, company, created_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const VALUES = [name, email, phone, dialCode, hash, image, jobTitle, company, createdAt];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            const getUserName = `SELECT * FROM business_admin WHERE id = ${rows.insertId} LIMIT 1`;
            const [userRows] = yield dbV2_1.default.query(getUserName);
            let token = yield utility.jwtGenerate(userRows[0].id);
            // delete userRows[0].id;
            return res.status(200).json({
                status: true,
                token,
                data: userRows[0],
                message: "Congratulations, Registered successfully !",
            });
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to Register, Please try again later");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.register = register;
// ====================================================================================================
// ====================================================================================================
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const hash = (0, md5_1.default)(password);
        const checkUserSql = `SELECT * FROM business_admin WHERE deleted_at IS NULL AND email = '${email}' LIMIT 1`;
        const [userData] = yield dbV2_1.default.query(checkUserSql);
        if (userData.length > 0) {
            const isLoggedIn = hash === userData[0].password; // true
            if (isLoggedIn) {
                let token = yield utility.jwtGenerate(userData[0].id);
                delete userData[0].password;
                // delete userData[0].id;
                return res.status(200).json({
                    status: true,
                    token,
                    data: userData[0],
                    message: "Successfully logged in !"
                });
            }
            else {
                return apiResponse.errorMessage(res, 400, "Wrong Password!");
            }
        }
        else {
            return apiResponse.errorMessage(res, 400, "User Not Registered With Us!");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Somethng went wrong");
    }
});
exports.login = login;
// ====================================================================================================
// ====================================================================================================
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const tempPass = utility.randomString(6);
        const hash = (0, md5_1.default)(tempPass);
        if (!email)
            return apiResponse.errorMessage(res, 400, "Email required");
        const emailCheckSql = `SELECT email, id FROM business_admin where email = '${email}' LIMIT 1`;
        const [rows] = yield dbV2_1.default.query(emailCheckSql);
        if (rows.length > 0) {
            const updatePassSql = `UPDATE business_admin SET password = ? where email = ?`;
            const VALUES = [hash, email];
            const [updatePassword] = yield dbV2_1.default.query(updatePassSql, VALUES);
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
const changeAdminPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const { oldPassword, newPassword } = req.body;
        const hash = (0, md5_1.default)(newPassword);
        const sql = `SELECT password from business_admin WHERE id = ${userId}`;
        const [data] = yield dbV2_1.default.query(sql);
        if (data.length > 0) {
            const oldPassCorrect = (0, md5_1.default)(oldPassword) == data[0].password;
            if (oldPassCorrect) {
                if (oldPassword === newPassword) {
                    return apiResponse.errorMessage(res, 400, "old password and new password can't same");
                }
                const updatePassSql = `Update business_admin Set password = ? where id = ?`;
                const VALUES = [hash, userId];
                const [updatePassword] = yield dbV2_1.default.query(updatePassSql, VALUES);
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
exports.changeAdminPassword = changeAdminPassword;
// ====================================================================================================
// ====================================================================================================
const changeUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId:string = res.locals.jwt.userId;    
        let userId;
        const type = req.body.type; //type = business, user, null
        if (type && type === development_1.default.businessType) {
            userId = req.body.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "User Id is required!");
        }
        const { newPassword } = req.body;
        const hash = (0, md5_1.default)(newPassword);
        const sql = `SELECT password from users WHERE id = ${userId}`;
        const [data] = yield dbV2_1.default.query(sql);
        if (data.length > 0) {
            //     const oldPassCorrect = md5(oldPassword) ==  data[0].password;
            //     if (oldPassCorrect) {
            //         if (oldPassword === newPassword) {
            //             return apiResponse.errorMessage(res, 400, "old password and new password can't same");
            //         }
            const updatePassSql = `Update users Set password = ? where id = ?`;
            const VALUES = [hash, userId];
            const [updatePassword] = yield dbV2_1.default.query(updatePassSql, VALUES);
            if (updatePassword.affectedRows > 0) {
                return apiResponse.successResponse(res, "Password updated successfully !", null);
            }
            else {
                return apiResponse.errorMessage(res, 400, "Something Went Wrong, Please Try again later");
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
exports.changeUserPassword = changeUserPassword;
// ====================================================================================================
// ====================================================================================================
