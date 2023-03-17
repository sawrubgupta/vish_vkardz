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
exports.updateUserFeaturesStatus = exports.getFeatureByUserId = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const getFeatureByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const sql = `SELECT users_features.feature_id, features.features, features.slug, users_features.status FROM features LEFT JOIN users_features ON features.id = users_features.feature_id WHERE users_features.user_id = ${userId} AND features.id IN (3, 5, 6, 8, 10, 11, 13, 14, 15)`;
        const [rows] = yield db_1.default.query(sql);
        const avgFeatureSql = `SELECT users_features.feature_id, features.features, features.slug, users_features.status FROM features LEFT JOIN users_features ON features.id = users_features.feature_id WHERE users_features.user_id = ${userId} AND features.id IN (3, 5, 6, 8, 10, 11) AND users_features.status = 1`;
        const [avgRows] = yield db_1.default.query(avgFeatureSql);
        const avgActiveFeature = (avgRows.length / 6) * 100;
        // return apiResponse.successResponse(res, "User Features Get Successfully", rows);
        return res.status(200).json({
            status: true,
            data: rows, avgActiveFeature,
            message: "User Features Get Successfully"
        });
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.getFeatureByUserId = getFeatureByUserId;
// ====================================================================================================
// ====================================================================================================
const updateUserFeaturesStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        const userId = res.locals.jwt.userId;
        let data;
        const sql = `UPDATE users_features SET status = ? WHERE user_id = ? AND feature_id = ?`;
        try {
            for (var _d = true, _e = __asyncValues(req.body.features), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                _c = _f.value;
                _d = false;
                try {
                    const element = _c;
                    const featureId = element.featureId;
                    const status = element.status;
                    let VALUES = [status, userId, featureId];
                    [data] = yield db_1.default.query(sql, VALUES);
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
            return apiResponse.successResponse(res, "Fatures updated successfully", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to update user featyre, try again");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.updateUserFeaturesStatus = updateUserFeaturesStatus;
// =======w============================================================================================
// ====================================================================================================
