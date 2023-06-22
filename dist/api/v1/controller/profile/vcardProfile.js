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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPinEnable = exports.vcardProfile = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const development_1 = __importDefault(require("../../config/development"));
const vcardProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        let key = req.query.key;
        if (!key || key === null)
            return apiResponse.errorMessage(res, 400, "Invalid Key!");
        const splitCode = key.split(development_1.default.vcardLink);
        let newCardNum = splitCode[1] || '';
        let splitNewCardNumber = newCardNum.split('/');
        let newCardNumber = splitNewCardNumber[0] || newCardNum;
        const getUserQuery = `SELECT * FROM users WHERE deleted_at IS NULL AND (username = '${key}' OR username = '${newCardNumber}' OR card_number = '${key}' OR card_number = '${newCardNumber}' OR card_number_fix = '${key}' OR card_number_fix = '${newCardNumber}') LIMIT 1`;
        // const getUserQuery = `SELECT * FROM users WHERE deleted_at IS NULL AND username = 'abhi76' LIMIT 1`;
        const [userRows] = yield db_1.default.query(getUserQuery);
        if (userRows.length > 0) {
            const userId = userRows[0].id;
            let display_number = [userRows[0].display_number];
            let display_email = [userRows[0].display_email];
            let address = [userRows[0].address];
            let website = [userRows[0].website];
            let company_name = [userRows[0].company_name];
            delete userRows[0].id;
            delete userRows[0].password;
            delete userRows[0].display_number;
            delete userRows[0].display_email;
            delete userRows[0].address;
            delete userRows[0].website;
            delete userRows[0].company_name;
            // if (userRows[0].is_password_enable === 1) {
            //     const profilePin = req.query.profilePin;
            //     if (profilePin !== userRows[0].set_password || !profilePin) return apiResponse.errorMessage(res, 400, "Invalid pin!");
            // }
            const getSocialSiteQuery = `SELECT social_sites.id, social_sites.name, social_sites.social_link, social_sites.social_img, social_sites.type, social_sites.status, social_sites.primary_profile, vcard_social_sites.value, vcard_social_sites.label, vcard_social_sites.orders FROM social_sites LEFT JOIN vcard_social_sites ON social_sites.id = vcard_social_sites.site_id AND vcard_social_sites.user_id = ${userId} HAVING vcard_social_sites.value IS NOT NULL ORDER BY vcard_social_sites.value DESC, vcard_social_sites.orders IS NULL ASC`;
            const [socialRows] = yield db_1.default.query(getSocialSiteQuery);
            const customFieldSql = `SELECT icon, value, type FROM vcf_custom_field WHERE user_id = ${userId} AND status = 1`;
            const [vcfRows] = yield db_1.default.query(customFieldSql);
            try {
                // const getThemes = `SELECT users.themes as themeId, vkard_layouts.vkard_style, vkard_layouts.image FROM users LEFT JOIN vkard_layouts ON users.vcard_layouts = vkard_layouts.id WHERE users.id = ${userId} LIMIT 1`;
                // const [themeData]:any = await pool.query(getThemes);
                for (var _d = true, vcfRows_1 = __asyncValues(vcfRows), vcfRows_1_1; vcfRows_1_1 = yield vcfRows_1.next(), _a = vcfRows_1_1.done, !_a;) {
                    _c = vcfRows_1_1.value;
                    _d = false;
                    try {
                        const ele = _c;
                        if (ele.type === development_1.default.vcfNumber || ele.type === development_1.default.vcfPhone) {
                            display_number.push(ele.value);
                        }
                        else if (ele.type === development_1.default.vcfEmail) {
                            display_email.push(ele.value);
                        }
                        else if (ele.type === development_1.default.vcfAddress) {
                            address.push(ele.value);
                        }
                        else if (ele.type === development_1.default.vcfCompany) {
                            company_name.push(ele.value);
                        }
                        else if (ele.type === development_1.default.vcfWebsite) {
                            website.push(ele.value);
                        }
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = vcfRows_1.return)) yield _b.call(vcfRows_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            userRows[0].display_number = display_number || [];
            userRows[0].display_email = display_email || [];
            userRows[0].address = address || [];
            userRows[0].company_name = company_name || [];
            userRows[0].website = website || [];
            userRows[0].socialSites = socialRows || [];
            // userRows[0].customField = vcfRows || [];
            // userRows[0].activeTheme = themeData[0] || {};
            return apiResponse.successResponse(res, "Data Retrieved Successfuly", userRows[0]);
        }
        else {
            return apiResponse.errorMessage(res, 400, "User not found!");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.vcardProfile = vcardProfile;
// ====================================================================================================
// ====================================================================================================
const checkPinEnable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId = res.locals.jwt.userId;
        let key = req.query.key;
        if (!key || key === null)
            return apiResponse.errorMessage(res, 400, "Invalid Key!");
        const splitCode = key.split(development_1.default.vcardLink);
        let newCardNum = splitCode[1] || '';
        let splitNewCardNumber = newCardNum.split('/');
        let newCardNumber = splitNewCardNumber[0] || newCardNum;
        const sql = `SELECT is_password_enable FROM users WHERE deleted_at IS NULL AND ((username = '${key}' OR username = '${newCardNumber}') OR (card_number = '${key}' OR card_number = '${newCardNumber}') OR (card_number_fix = '${key}' OR card_number_fix = '${newCardNumber}')) LIMIT 1`;
        const [rows] = yield db_1.default.query(sql);
        if (rows.length === 0)
            return apiResponse.errorMessage(res, 400, "Activate your card");
        return apiResponse.successResponse(res, "Data Retrieved Successfully", rows[0]);
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.checkPinEnable = checkPinEnable;
// ====================================================================================================
// ====================================================================================================
