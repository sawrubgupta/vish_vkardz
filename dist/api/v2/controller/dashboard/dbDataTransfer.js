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
exports.userToUserProfileDataTransfer = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const userToUserProfileDataTransfer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        const userId = res.locals.jwt.userId;
        const currentDate = utility.dateWithFormat();
        if (userId && !userId)
            return apiResponse.errorMessage(res, 400, "You don't have access!!");
        const userQuery = `SELECT * FROM users`;
        const [userRows] = yield db_1.default.query(userQuery);
        // const userProfileSql = `INSERT INTO users_profile(user_id, profile_image, cover_photo, hit, share_link, qr_code, language, vcard_layouts, vcard_bg_color, font, is_private, is_private, set_password, on_tap_url, is_default, created_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        let userProfileSql = `INSERT INTO users_profile(user_id, profile_image, cover_photo, hit, share_link, qr_code, language, vcard_layouts, vcard_bg_color, set_password, on_tap_url, is_default, created_at) VALUES `;
        let result;
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
                    userProfileSql = userProfileSql + ` (${userId}, '${thumb}', '${cover_photo}', ${hit}, ${share_link}, '${qr_code}', 'eng', ${vcard_layouts}, '${vcard_bg_color}', '${set_password}', '${primary_profile_link}', 1, '${currentDate}'), `;
                    result = userProfileSql.substring(0, userProfileSql.lastIndexOf(','));
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
        const [rows] = yield db_1.default.query(result);
        if (rows.affectedRows > 0) {
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
// export const 
// ====================================================================================================
// ====================================================================================================
