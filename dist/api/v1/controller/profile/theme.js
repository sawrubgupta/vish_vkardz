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
exports.updateVcardLayout = exports.getLayout = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const development_1 = __importDefault(require("../../config/development"));
const getLayout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = `SELECT * FROM layout_types`;
        let [layoutTypeData] = yield db_1.default.query(sql);
        const sql1 = `SELECT * FROM vkard_layouts`;
        const [data] = yield db_1.default.query(sql1);
        let rowIndex = -1;
        for (const element of layoutTypeData) {
            rowIndex++;
            layoutTypeData[rowIndex].layout = [];
            let dataIndex = -1;
            for (const e of data) {
                dataIndex++;
                if (element.id === e.type_id) {
                    (layoutTypeData[rowIndex].layout).push(e);
                }
            }
        }
        return apiResponse.successResponse(res, "Layouts get Succesfully", layoutTypeData);
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.getLayout = getLayout;
// ====================================================================================================
// ====================================================================================================
const updateVcardLayout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId;
        const type = req.query.type; //type = business, user, null
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.query.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !");
        }
        const profileColor = req.body.profileColor;
        let styleId = req.body.styleId;
        // if (!styleId || styleId === "") {
        //     styleId = 1;
        // }
        const sql = `UPDATE users SET vcard_layouts = ?, vcard_bg_color = ? WHERE id = ?`;
        const VALUES = [styleId, profileColor, userId];
        const [rows] = yield db_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Layout updated successfully", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to update layout, try again");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.updateVcardLayout = updateVcardLayout;
// ====================================================================================================
// ====================================================================================================
