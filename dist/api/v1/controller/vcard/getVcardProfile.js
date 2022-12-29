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
exports.getVcardProfile = void 0;
const apiResponse = __importStar(require("../../helper/apiResponse"));
const db_1 = __importDefault(require("../../../../db"));
const getVcardProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 404, "User profile not found !");
        }
        const sql = `SELECT id, username, card_number, full_name, thumb, cover_photo, vcard_layouts,  vcard_bg_color, designation, company_name, display_email, display_dial_code, display_number, website, display_email, address, colors FROM users WHERE id = ${userId} LIMIT 1`;
        const [userData] = yield db_1.default.query(sql);
        if (userData.length > 0) {
            const getSocialSiteQyery = `SELECT social_sites.id, social_sites.name, social_sites.social_link, social_sites.social_img, social_sites.type, social_sites.status, social_sites.primary_profile, vcard_social_sites.value, vcard_social_sites.orders FROM social_sites INNER JOIN vcard_social_sites on social_sites.id = vcard_social_sites.site_id AND vcard_social_sites.user_id = ${userId} ORDER BY vcard_social_sites.orders IS NULL ASC`;
            const [socialRows] = yield db_1.default.query(getSocialSiteQyery);
            if (socialRows.length > 0) {
                userData[0].socialSites = socialRows;
                return apiResponse.successResponse(res, "Get user vcard profile data !", userData[0]);
            }
            else {
                userData[0].socialSites = null;
                return apiResponse.successResponse(res, "Get user vcard profile data !", userData[0]);
            }
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.getVcardProfile = getVcardProfile;
// ====================================================================================================
// ====================================================================================================
