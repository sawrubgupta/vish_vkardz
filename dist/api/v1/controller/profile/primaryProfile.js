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
exports.addPrimaryLink = exports.getPrimarySite = exports.setPrimaryProfile = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const setPrimaryProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const primaryProfileSlug = req.body.primaryProfileSlug;
        let vcardLink = `https://vkardz.com/`;
        const checkSocialSite = `SELECT label, value FROM vcard_social_sites WHERE user_id = ? AND label = ? LIMIT 1`;
        const siteVALUES = [userId, primaryProfileSlug];
        const [siteRows] = yield db_1.default.query(checkSocialSite, siteVALUES);
        if (siteRows.length > 0) {
            const link = siteRows[0].value;
            const primaryProfileQuery = `UPDATE users SET primary_profile_slug = ?, primary_profile_link = ? WHERE id = ?`;
            const VALUES = [primaryProfileSlug, link, userId];
            const [rows] = yield db_1.default.query(primaryProfileQuery, VALUES);
            if (rows.affectedRows > 0) {
                return apiResponse.successResponse(res, "Primary Profile Added Successfully", primaryProfileSlug);
            }
            else {
                return apiResponse.errorMessage(res, 400, "Failed to Add Primary Profile, try again!");
            }
        }
        else if (primaryProfileSlug === 'vcard') {
            let uName;
            const getUser = `SELECT username, card_number, card_number_fix FROM users WHERE id = ${userId}`;
            const [userRows] = yield db_1.default.query(getUser);
            if (userRows[0].card_number !== null && userRows[0].card_number !== undefined && userRows[0].card_number !== '') {
                uName = userRows[0].card_number;
            }
            else if (userRows[0].card_number_fix !== null && userRows[0].card_number_fix !== undefined && userRows[0].card_number_fix !== '') {
                uName = userRows[0].card_number_fix;
            }
            else {
                uName = userRows[0].username;
            }
            const vcardProfileLink = (vcardLink) + (uName);
            const primaryProfileQuery = `UPDATE users SET primary_profile_slug = ?, primary_profile_link = ? WHERE id = ?`;
            const VALUES = [primaryProfileSlug, vcardProfileLink, userId];
            const [rows] = yield db_1.default.query(primaryProfileQuery, VALUES);
            if (rows.affectedRows > 0) {
                return apiResponse.successResponse(res, "Primary Profile Added Successfully", primaryProfileSlug);
            }
            else {
                return apiResponse.errorMessage(res, 400, "Failed to Add Primary Profile, try again!");
            }
        }
        else {
            return apiResponse.errorMessage(res, 400, `Please add '${primaryProfileSlug}' Information`);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.setPrimaryProfile = setPrimaryProfile;
// ====================================================================================================
// ====================================================================================================
const getPrimarySite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        let addManual = { id: 0, name: "vcard" };
        const siteQuery = `SELECT id, name FROM social_sites WHERE primary_profile = 1`;
        const [siteRows] = yield db_1.default.query(siteQuery);
        const sql = `SELECT primary_profile_slug FROM users WHERE id = ${userId}`;
        const [userRows] = yield db_1.default.query(sql);
        siteRows.unshift(addManual);
        siteRows.forEach((a, b) => {
            userRows.forEach((a1, b1) => {
                if (siteRows[b].name === userRows[b1].primary_profile_slug || siteRows[b].name === addManual) {
                    siteRows[b].isActive = true;
                }
                else {
                    siteRows[b].isActive = false;
                }
            });
        });
        return apiResponse.successResponse(res, "Data Retrieved successfully", siteRows);
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.getPrimarySite = getPrimarySite;
// ====================================================================================================
// ====================================================================================================
const addPrimaryLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const { primaryProfileLink } = req.body;
        const primaryProfileQuery = `UPDATE users SET primary_profile_link = ? WHERE id = ?`;
        const VALUES = [primaryProfileLink, userId];
        const [rows] = yield db_1.default.query(primaryProfileQuery, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Primary Profile Added Successfully", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to Add Primary Profile, try again!");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.addPrimaryLink = addPrimaryLink;
// ====================================================================================================
// ====================================================================================================
