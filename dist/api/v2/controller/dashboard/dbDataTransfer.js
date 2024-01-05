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
exports.cardDataTransfer = exports.vcInfoDataAdd = exports.addUserNewFeature = exports.userToUserProfileDataTransfer = void 0;
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const development_1 = __importDefault(require("../../config/development"));
const userToUserProfileDataTransfer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        const userId = res.locals.jwt.userId;
        const currentDate = utility.dateWithFormat();
        const accessCode = req.body.accessCode;
        if (accessCode != "vKardzDbDataTransfer")
            return apiResponse.errorMessage(res, 400, "You don't have access!!");
        // if (userId && !userId) return apiResponse.errorMessage(res, 400, "You don't have access!!");
        // return apiResponse.errorMessage(res, 400, "You don't have access!!");
        const userQuery = `SELECT * FROM users`;
        const [userRows] = yield dbV2_1.default.query(userQuery);
        // const userProfileSql = `INSERT INTO users_profile(user_id, profile_image, cover_photo, hit, share_link, qr_code, language, vcard_layouts, vcard_bg_color, font, is_private, is_private, set_password, on_tap_url, is_default, created_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        let userProfileSql = `INSERT INTO users_profile(user_id, profile_image, cover_photo, hit, share_link, qr_code, language, vcard_layouts, vcard_bg_color, set_password, on_tap_url, is_default, created_at) VALUES `;
        let result;
        let packageSql = `INSERT INTO users_package(user_id, package_id, start_time, end_time) VALUES `;
        let packageResult;
        let VALUES;
        try {
            for (var _d = true, userRows_1 = __asyncValues(userRows), userRows_1_1; userRows_1_1 = yield userRows_1.next(), _a = userRows_1_1.done, !_a;) {
                _c = userRows_1_1.value;
                _d = false;
                try {
                    const userEle = _c;
                    const userId = userEle.id;
                    const thumb = userEle.thumb;
                    const cover_photo = userEle.cover_photo;
                    const hit = userEle.hit;
                    const share_link = userEle.share_link;
                    const qr_code = userEle.qr_code;
                    const vcard_layouts = userEle.vcard_layouts;
                    const vcard_bg_color = userEle.vcard_bg_color;
                    const set_password = userEle.set_password;
                    const primary_profile_link = userEle.primary_profile_link;
                    const accountType = userEle.account_type;
                    const startTime = userEle.start_date;
                    const endTime = userEle.end_date;
                    // userProfileSql = userProfileSql + ` (${userId}, '${thumb}', '${cover_photo}', ${hit}, ${share_link}, '${qr_code}', 'eng', ${vcard_layouts}, '${vcard_bg_color}', ${set_password}, '${primary_profile_link}', 1, '${currentDate}'), `;
                    VALUES = VALUES + ` (${userId}, '${thumb}', '${cover_photo}', ${hit}, ${share_link}, '${qr_code}', 'eng', ${vcard_layouts}, '${vcard_bg_color}', ${set_password}, '${primary_profile_link}', 1, '${currentDate}'), `;
                    result = userProfileSql.substring(0, userProfileSql.lastIndexOf(','));
                    packageSql = packageSql + ` (${userId}, ${accountType}, '${startTime}', '${endTime}'), `;
                    packageResult = packageSql.substring(0, packageSql.lastIndexOf(','));
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = userRows_1.return)) yield _b.call(userRows_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        console.log(result);
        const [rows] = yield dbV2_1.default.query(result);
        if (rows.affectedRows > 0) {
            const [packageRows] = yield dbV2_1.default.query(packageResult);
            return yield apiResponse.successResponse(res, "Transfer successfully", null);
        }
        else {
            return yield apiResponse.errorMessage(res, 400, "Failed!!");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.userToUserProfileDataTransfer = userToUserProfileDataTransfer;
// ====================================================================================================
// ====================================================================================================
// UPDATE vcf_custom_field
// JOIN users_profile ON vcf_custom_field.user_id = users_profile.user_id
// SET vcf_custom_field.profile_id = users_profile.id;
// ====================================================================================================
// ====================================================================================================
const addUserNewFeature = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId = res.locals.jwt.userId;
        // if (userId || !userId) return apiResponse.errorMessage(res, 400, "you don't have access");
        const accessCode = req.body.accessCode;
        if (accessCode != "vKardzDbDataTransfer")
            return apiResponse.errorMessage(res, 400, "You don't have access!!");
        const userSql = `SELECT * FROM  `;
        const [userRows] = yield dbV2_1.default.query(userSql);
        for (const userEle of userRows) {
            const uid = userEle.user_id;
            const profileId = userEle.id;
            const getFeatures = `SELECT * FROM features WHERE id between 18 AND 38`;
            const [featureData] = yield dbV2_1.default.query(getFeatures);
            let featureStatus = 1;
            let featureResult;
            let addFeatures = `INSERT INTO users_features(feature_id, profile_id, user_id,status) VALUES`;
            for (const element of featureData) {
                // if (element.id === 1 || element.id === 2 || element.id === 13 || element.id === 14 || element.id === 15) {
                //     featureStatus = 1
                // } else {
                //     featureStatus = 0
                // }
                addFeatures = addFeatures + `(${element.id}, ${profileId}, ${uid}, ${featureStatus}), `;
                featureResult = addFeatures.substring(0, addFeatures.lastIndexOf(','));
            }
            const [userFeatureData] = yield dbV2_1.default.query(featureResult);
            console.log("userFeatureData", userFeatureData);
        }
        return apiResponse.successResponse(res, "Success", null);
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.addUserNewFeature = addUserNewFeature;
// ====================================================================================================
// ====================================================================================================
const vcInfoDataAdd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, e_2, _f, _g;
    try {
        const userId = res.locals.jwt.userId;
        const currentDate = utility.dateWithFormat();
        const accessCode = req.body.accessCode;
        if (accessCode != "vKardzDbDataTransfer")
            return apiResponse.errorMessage(res, 400, "You don't have access!!");
        // if (userId && !userId) return apiResponse.errorMessage(res, 400, "You don't have access!!");
        // return apiResponse.errorMessage(res, 400, "You don't have access!!");
        const userQuery = `SELECT * FROM users`;
        const [userRows] = yield dbV2_1.default.query(userQuery);
        // const userProfileSql = `INSERT INTO users_profile(user_id, profile_image, cover_photo, hit, share_link, qr_code, language, vcard_layouts, vcard_bg_color, font, is_private, is_private, set_password, on_tap_url, is_default, created_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        // let userProfileSql = `INSERT INTO users_profile(user_id, profile_image, cover_photo, hit, share_link, qr_code, language, vcard_layouts, vcard_bg_color, set_password, on_tap_url, is_default, created_at) VALUES `;
        // let result: any;
        let vcfSql = `INSERT INTO vcf_info(user_id, profile_id, type, value) VALUES `;
        let vcfResult;
        try {
            for (var _h = true, userRows_2 = __asyncValues(userRows), userRows_2_1; userRows_2_1 = yield userRows_2.next(), _e = userRows_2_1.done, !_e;) {
                _g = userRows_2_1.value;
                _h = false;
                try {
                    const userEle = _g;
                    const userId = userEle.id;
                    const name = userEle.name;
                    const email = userEle.email;
                    const phone = userEle.phone;
                    const website = userEle.website;
                    const company_name = userEle.company_name;
                    const address = userEle.address;
                    const gender = userEle.gender;
                    const designation = userEle.designation;
                    // const accountType = userEle.account_type;
                    // const startTime = userEle.start_date;
                    // const endTime = userEle.end_date;
                    // userProfileSql = userProfileSql + ` (${userId}, '${thumb}', '${cover_photo}', ${hit}, ${share_link}, '${qr_code}', 'eng', ${vcard_layouts}, '${vcard_bg_color}', ${set_password}, '${primary_profile_link}', 1, '${currentDate}'), `;
                    // result = userProfileSql.substring(0, userProfileSql.lastIndexOf(','));
                    // vcfSql = vcfSql + ` (${userId}, 0, '${config.vcfName}', '${name}'), (${userId}, 0, '${config.vcfEmail}', '${email}'), (${userId}, 0, '${config.vcfPhone}', '${phone}'), (${userId}, 0, '${config.vcfWebsite}', '${website}'), (${userId}, 0, '${config.vcfCompany}', '${company_name}'), (${userId}, 0, '${config.vcfAddress}', '${address}'), (${userId}, 0, '${config.vcfGender}', '${gender}'), (${userId}, 0, '${config.vcfDesignation}', '${designation}'),`;
                    vcfSql = vcfSql + ` (${userId}, 0, '${development_1.default.vcfName}', '${name}'), (${userId}, 0, '${development_1.default.vcfEmail}', '${email}'), (${userId}, 0, '${development_1.default.vcfPhone}', '${phone}'), (${userId}, 0, '${development_1.default.vcfWebsite}', '${website}'), (${userId}, 0, '${development_1.default.vcfCompany}', '${company_name}'), (${userId}, 0, '${development_1.default.vcfAddress}', '${address}'), (${userId}, 0, '${development_1.default.vcfGender}', '${gender}'), (${userId}, 0, '${development_1.default.vcfDesignation}', '${designation}'),`;
                    vcfResult = vcfSql.substring(0, vcfSql.lastIndexOf(','));
                }
                finally {
                    _h = true;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_h && !_e && (_f = userRows_2.return)) yield _f.call(userRows_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        console.log("vcfSql", vcfSql);
        // const [rows]: any = await pool.query(result)
        // if (rows.affectedRows > 0) {
        // return await apiResponse.successResponse(res, "Transfer successfully", null);
        const [packageRows] = yield dbV2_1.default.query(vcfResult);
        return yield apiResponse.successResponse(res, "Transfer successfully", null);
        // } else {
        //     return await apiResponse.errorMessage(res, 400, "Failed!!");
        // }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.vcInfoDataAdd = vcInfoDataAdd;
// ====================================================================================================
// ====================================================================================================
const cardDataTransfer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _j, e_3, _k, _l;
    try {
        const userId = res.locals.jwt.userId;
        const currentDate = utility.dateWithFormat();
        const accessCode = req.body.accessCode;
        if (accessCode != "vKardzDbDataTransfer")
            return apiResponse.errorMessage(res, 400, "You don't have access!!");
        const userSql = `SELECT id, card_number, card_number_fix, is_card_linked FROM users WHERE (card_number IS NOT NULL OR card_number_fix IS NOT NULL) AND card_number != ''`;
        const [userRows] = yield dbV2_1.default.query(userSql);
        let sql = `INSERT INTO user_card(user_id, card_number, card_number_fix, is_card_linked, created_at) VALUES `;
        let result;
        try {
            for (var _m = true, userRows_3 = __asyncValues(userRows), userRows_3_1; userRows_3_1 = yield userRows_3.next(), _j = userRows_3_1.done, !_j;) {
                _l = userRows_3_1.value;
                _m = false;
                try {
                    const ele = _l;
                    const userId = ele.id;
                    const card_number = ele.card_number;
                    const card_number_fix = ele.card_number_fix;
                    const is_card_linked = ele.is_card_linked;
                    sql = sql + ` (${userId}, '${card_number}', '${card_number_fix}', ${is_card_linked}, '${currentDate}'), `;
                    result = sql.substring(0, sql.lastIndexOf(','));
                }
                finally {
                    _m = true;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (!_m && !_j && (_k = userRows_3.return)) yield _k.call(userRows_3);
            }
            finally { if (e_3) throw e_3.error; }
        }
        const [rows] = yield dbV2_1.default.query(result);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Data Transfer Successfully", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.cardDataTransfer = cardDataTransfer;
// ====================================================================================================
// ====================================================================================================
