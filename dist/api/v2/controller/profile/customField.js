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
exports.getUserCustomField = exports.deleteUsercf = exports.addUserInfo = exports.getVcf = exports.deleteVcf = exports.addCustomField = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const development_1 = __importDefault(require("../../config/development"));
const utility = __importStar(require("../../helper/utility"));
const addCustomField = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        let userId;
        const type = req.body.type; //type = business, user, null
        if (type && type === development_1.default.businessType) {
            userId = req.body.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !");
        }
        // const { vcfType, vcfValue, status } = req.body;
        // let vcfSql = `INSERT INTO vcf_custom_field(user_id, value, type, status) VALUES `
        let result;
        try {
            for (var _d = true, _e = __asyncValues(req.body.vcfData), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                _c = _f.value;
                _d = false;
                try {
                    const ele = _c;
                    const vcfId = ele.vcfId;
                    const vcfType = ele.vcfType;
                    const vcfValue = ele.vcfValue;
                    const status = ele.status;
                    const checkVcfSql = `SELECT id FROM vcf_custom_field WHERE user_id = ${userId} AND id = '${vcfId}'`;
                    const [vcfRows] = yield db_1.default.query(checkVcfSql);
                    if (vcfRows.length > 0) {
                        const updateVcfSql = `UPDATE vcf_custom_field SET value = '${vcfValue}', type = '${vcfType}', status = ${status} WHERE id = ${vcfId} AND user_id = ${userId}`;
                        [result] = yield db_1.default.query(updateVcfSql);
                    }
                    else {
                        let insertVcfSql = `INSERT INTO vcf_custom_field(user_id, value, type, status) VALUES (${userId}, '${vcfValue}', '${vcfType}', ${status})`;
                        [result] = yield db_1.default.query(insertVcfSql);
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
        if (result.affectedRows > 0) {
            return apiResponse.successResponse(res, "Custom Field added successfully", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to add custom field, Please try again!");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.addCustomField = addCustomField;
// ====================================================================================================
// ====================================================================================================
const deleteVcf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId;
        const type = req.body.type; //type = business, user, null
        if (type && type === development_1.default.businessType) {
            userId = req.body.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !");
        }
        const vcfId = req.body.vcfId;
        if (!vcfId || vcfId === null || vcfId === '') {
            return apiResponse.errorMessage(res, 400, "Id is required!");
        }
        const sql = `DELETE FROM vcf_custom_field WHERE id = ${vcfId} AND user_id = ${userId}`;
        const [rows] = yield db_1.default.query(sql);
        return apiResponse.successResponse(res, "Extra Field Deleted Sucessfully", null);
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.deleteVcf = deleteVcf;
// ====================================================================================================
// ====================================================================================================
const getVcf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId;
        const type = req.query.type; //type = business, user, null
        if (type && type === development_1.default.businessType) {
            userId = req.query.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !");
        }
        const sql = `SELECT * FROM vcf_custom_field WHERE user_id = ${userId}`;
        const [rows] = yield db_1.default.query(sql);
        return apiResponse.successResponse(res, "Data Retrieved Successfully", rows);
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.getVcf = getVcf;
// ====================================================================================================
// ====================================================================================================
const addUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId;
        const { profileId, vcfType, vcfValue } = req.body;
        const type = req.body.type; //type = business, user, null
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.body.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !");
        }
        const createdAt = utility.dateWithFormat();
        const vcfInfoSql = `INSERT INTO vcf_info(user_id, profile_id, type, value, status, created_at) VALUES(?, ?, ?, ?, ?, ?)`;
        const vcfVALUES = [userId, profileId, vcfType, vcfValue, 1, createdAt];
        const [vcfInfoRows] = yield db_1.default.query(vcfInfoSql, vcfVALUES);
        if (vcfInfoRows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Success", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed!, try again");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.addUserInfo = addUserInfo;
// ====================================================================================================
// ====================================================================================================
const deleteUsercf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId;
        const type = req.body.type; //type = business, user, null
        if (type && type === development_1.default.businessType) {
            userId = req.body.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !");
        }
        const fieldId = req.body.fieldId;
        if (!fieldId || fieldId === null || fieldId === '') {
            return apiResponse.errorMessage(res, 400, "Id is required!");
        }
        const sql = `DELETE FROM vcf_info WHERE id = ${fieldId} AND user_id = ${userId}`;
        const [rows] = yield db_1.default.query(sql);
        return apiResponse.successResponse(res, "Extra Field Deleted Sucessfully", null);
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.deleteUsercf = deleteUsercf;
// ====================================================================================================
// ====================================================================================================
const getUserCustomField = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId;
        const type = req.query.type; //type = business, user, null
        const profileId = req.query.profileId;
        if (type && type === development_1.default.businessType) {
            userId = req.query.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !");
        }
        const sql = `SELECT * FROM vcf_info WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [rows] = yield db_1.default.query(sql);
        return apiResponse.successResponse(res, "Data Retrieved Successfully", rows);
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.getUserCustomField = getUserCustomField;
// ====================================================================================================
// ====================================================================================================
