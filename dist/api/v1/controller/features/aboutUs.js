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
exports.deleteAboutUs = exports.getAboutUs = exports.addUpdateAboutUs = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const addUpdateAboutUs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const createdAt = utility.dateWithFormat();
        const { companyName, year, business, aboutUsDetail, image } = req.body;
        const getAboutUs = `SELECT id FROM about WHERE user_id = ${userId}`;
        const [aboutUsRows] = yield db_1.default.query(getAboutUs);
        if (aboutUsRows.length > 0) {
            const updateQuery = `UPDATE about SET company_name = ?, year = ?, business = ?, about_detail = ?, images = ? WHERE user_id = ?`;
            const VALUES = [companyName, year, business, aboutUsDetail, image, userId];
            const [updatedRows] = yield db_1.default.query(updateQuery, VALUES);
            if (updatedRows.affectedRows > 0) {
                return apiResponse.successResponse(res, "Updated Successfully", null);
            }
            else {
                return apiResponse.errorMessage(res, 400, "Failed to update, try again");
            }
        }
        else {
            const insertedQuery = `INSERT INTO about(user_id, company_name, business, year, about_detail, images, created_at) VALUES (?, ?, ?, ?, ?, ? ,?)`;
            const insertVALUES = [userId, companyName, business, year, aboutUsDetail, image, createdAt];
            const [insertedRows] = yield db_1.default.query(insertedQuery, insertVALUES);
            if (insertedRows.affectedRows > 0) {
                return apiResponse.successResponse(res, "Inserted Successfully", null);
            }
            else {
                return apiResponse.errorMessage(res, 400, "Failed to insert, try again");
            }
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.addUpdateAboutUs = addUpdateAboutUs;
// ====================================================================================================
// ====================================================================================================
const getAboutUs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const sql = `SELECT id, company_name, business, year, about_detail, images, created_at FROM about WHERE user_id = ${userId}`;
        const [rows] = yield db_1.default.query(sql);
        const getFeatureStatus = `SELECT status FROM users_features WHERE user_id = ${userId} AND feature_id = 3`;
        const [featureStatusRRows] = yield db_1.default.query(getFeatureStatus);
        let featureStatus = featureStatusRRows[0].status;
        if (rows.length > 0) {
            rows[0].featureStatus = featureStatus;
            return apiResponse.successResponse(res, "Data Retrieved Successfully", rows[0]);
        }
        else {
            // return apiResponse.successResponse(res, "No Data Found", null)
            return res.status(200).json({
                status: true,
                data: null, featureStatus,
                message: "No Data Found"
            });
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.getAboutUs = getAboutUs;
// ====================================================================================================
// ====================================================================================================
const deleteAboutUs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const sql = `DELETE FROM about WHERE user_id = ${userId}`;
        const [rows] = yield db_1.default.query(sql);
        return apiResponse.successResponse(res, "Deleted Successfully", null);
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.deleteAboutUs = deleteAboutUs;
// ====================================================================================================
// ====================================================================================================
