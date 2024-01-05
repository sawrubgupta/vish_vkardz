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
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const development_1 = __importDefault(require("../../config/development"));
const responseMsg_1 = __importDefault(require("../../config/responseMsg"));
const themeResMsg = responseMsg_1.default.profile.theme;
const getLayout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = `SELECT * FROM layout_types`;
        let [layoutTypeData] = yield dbV2_1.default.query(sql);
        const sql1 = `SELECT * FROM vkard_layouts WHERE status = 1`;
        const [data] = yield dbV2_1.default.query(sql1);
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
        return apiResponse.successResponse(res, themeResMsg.getLayout.successMsg, layoutTypeData);
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.getLayout = getLayout;
// ====================================================================================================
// ====================================================================================================
const updateVcardLayout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId;
        const type = req.body.type; //type = business, user, null
        const profileId = req.body.profileId;
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.body.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, themeResMsg.updateVcardLayout.nullUserId);
        const { profileColor, styleId } = req.body;
        // if (!styleId || styleId === "") {
        //     styleId = 1;
        // }
        const sql = `UPDATE users_profile SET vcard_layouts = ?, vcard_bg_color = ? WHERE user_id = ? AND id = ?`;
        const VALUES = [styleId, profileColor, userId, profileId];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, themeResMsg.updateVcardLayout.successMsg, null);
        }
        else {
            return apiResponse.errorMessage(res, 400, themeResMsg.updateVcardLayout.failedMsg);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.updateVcardLayout = updateVcardLayout;
// ====================================================================================================
// ====================================================================================================
