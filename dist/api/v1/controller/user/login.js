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
exports.login = void 0;
const db_1 = __importDefault(require("../../../../db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const utility = __importStar(require("../../helper/utility"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email || req.body.phone || req.body.username;
        const password = req.body.password;
        const createdAt = utility.dateWithFormat();
        let vcardLink = `https://vkardz.com/`;
        let uName;
        const getUser = `SELECT * FROM users where email = '${email}' or phone = '${email}' or username = '${email}' limit 1`;
        const [userRows] = yield db_1.default.query(getUser);
        if (userRows.length === 0) {
            return apiResponse.errorMessage(res, 400, "User not registered with us, Please signup");
        }
        if (userRows[0].card_number !== null && userRows[0].card_number !== undefined && userRows[0].card_number !== '') {
            uName = userRows[0].card_number;
        }
        else if (userRows[0].card_number_fix !== null && userRows[0].card_number_fix !== undefined && userRows[0].card_number_fix !== '') {
            uName = userRows[0].card_number_fix;
        }
        else {
            uName = userRows[0].username;
        }
        const hashedPassword = userRows[0].password;
        let vcardProfileLink = (vcardLink) + (uName);
        userRows[0].share_url = vcardProfileLink;
        bcryptjs_1.default.compare(password, hashedPassword, (err, isMatch) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return apiResponse.errorMessage(res, 400, "Failed to login, Please try again or Contact support team");
            }
            if (isMatch) {
                const sql = `UPDATE users set login_time = ? where id = ?`;
                const VALUES = [createdAt, userRows[0].id];
                console.log(VALUES);
                const [data] = yield db_1.default.query(sql, VALUES);
                if (data.affectedRows > 0) {
                    let token = yield utility.jwtGenerate(userRows[0].id);
                    delete userRows[0].password;
                    delete userRows[0].id;
                    return res.status(200).json({
                        status: true,
                        token,
                        data: userRows[0],
                        message: "Successfully logged in !"
                    });
                }
                else {
                    return apiResponse.errorMessage(res, 400, "Failed to login, try again");
                }
            }
            if (!isMatch) {
                return apiResponse.errorMessage(res, 400, "Unfortunately, Email and Password is incorrect!!");
            }
        }));
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.login = login;
// ====================================================================================================
// ====================================================================================================
