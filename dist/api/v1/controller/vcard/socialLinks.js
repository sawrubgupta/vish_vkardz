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
exports.deleteSocialLink = exports.updateSocialLinks = exports.getSocialLinks = void 0;
const apiResponse = __importStar(require("../../helper/apiResponse"));
const db_1 = __importDefault(require("../../../../db"));
const utility = __importStar(require("../../helper/utility"));
const getSocialLinks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const sql = `SELECT social_sites.id, social_sites.name, social_sites.social_link, social_sites.social_img, social_sites.type, social_sites.status, social_sites.primary_profile, social_sites.icon, social_sites.mobile_icon, vcard_social_sites.value, vcard_social_sites.label, vcard_social_sites.orders FROM social_sites LEFT JOIN vcard_social_sites ON social_sites.id = vcard_social_sites.site_id AND vcard_social_sites.user_id = ${userId} ORDER BY  vcard_social_sites.orders IS NULL ASC`;
        const [socialRows] = yield db_1.default.query(sql);
        return apiResponse.successResponse(res, "List of all social links.", socialRows);
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.getSocialLinks = getSocialLinks;
// ====================================================================================================
// ====================================================================================================
const updateSocialLinks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        const userId = res.locals.jwt.userId;
        const createdAt = utility.dateWithFormat();
        let data;
        let updateQuery = `UPDATE vcard_social_sites SET orders = ?, label = ?, value = ? WHERE user_id = ? AND site_id = ?`;
        let insertQuery = `INSERT INTO vcard_social_sites (user_id, site_id, orders, label, value, created_at) VALUES(?, ?, ?, ?, ?, ?)`;
        try {
            for (var _d = true, _e = __asyncValues(req.body.socialSites), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                _c = _f.value;
                _d = false;
                try {
                    const socialSiteItem = _c;
                    const siteId = socialSiteItem.siteId;
                    const siteValue = socialSiteItem.siteValue;
                    const orders = socialSiteItem.orders;
                    const siteLabel = socialSiteItem.siteLabel;
                    const sql = `SELECT * From vcard_social_sites WHERE user_id = ${userId} AND site_id = ${siteId}`;
                    const [socialRows] = yield db_1.default.query(sql);
                    if (socialRows.length > 0) {
                        const VALUES = [orders, siteLabel, siteValue, userId, siteId];
                        [data] = yield db_1.default.query(updateQuery, VALUES);
                    }
                    else {
                        const VALUES = [userId, siteId, orders, siteLabel, siteValue, createdAt];
                        [data] = yield db_1.default.query(insertQuery, VALUES);
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
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Scial link updated successflly", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to update social link, try again later");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.updateSocialLinks = updateSocialLinks;
// ====================================================================================================
// ====================================================================================================
const deleteSocialLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const siteId = req.query.siteId;
        const sql = `DELETE FROM vcard_social_sites WHERE user_id = ? AND site_id = ?`;
        const VALUES = [userId, siteId];
        const [data] = yield db_1.default.query(sql, VALUES);
        return apiResponse.successResponse(res, "Social link deleted successfully", null);
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Soething went wrong");
    }
});
exports.deleteSocialLink = deleteSocialLink;
// ====================================================================================================
// ====================================================================================================
