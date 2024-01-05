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
exports.removeCard = exports.deactivateCard = void 0;
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const development_1 = __importDefault(require("../../config/development"));
const utility = __importStar(require("../../helper/utility"));
//not used
const deactivateCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId;
        const currentDate = utility.dateWithFormat();
        const type = req.query.type; //type = business, user, null
        const profileId = req.query.profileId;
        console.log("profileId", profileId);
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.query.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, "User Id is required!");
        if (!profileId || profileId === null)
            return apiResponse.errorMessage(res, 400, "Profile id is required");
        const sql = `UPDATE users_profile SET is_card_linked = ? WHERE user_id = ? AND id = ?`;
        const VALUES = [0, userId, profileId];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            const userCardSql = `UPDATE user_card SET deactivated_at = ? WHERE user_id = ? AND profile_id = ?`;
            const cardVALUES = [currentDate, userId, profileId];
            const [cardRows] = yield dbV2_1.default.query(userCardSql, cardVALUES);
            return apiResponse.successResponse(res, "Your card is Deactivated!", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to Deactive the card, please try again later !");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.deactivateCard = deactivateCard;
// ====================================================================================================
// ====================================================================================================
const removeCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId;
        const type = req.body.type; //type = business, user, null
        const profileId = req.body.profileId;
        const cardId = req.body.cardId;
        const currentDate = utility.dateWithFormat();
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.body.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, "User Id is required!");
        // if (!profileId || profileId === null) return apiResponse.errorMessage(res, 400, "Profile id is required");
        if (!cardId || cardId === null)
            return apiResponse.errorMessage(res, 400, "cardId is required");
        const cardSql = `SELECT * FROM user_card WHERE user_id = ${userId} AND id = ${cardId} LIMIT 1`;
        const [cardRows] = yield dbV2_1.default.query(cardSql);
        if (cardRows.length === 0)
            return apiResponse.errorMessage(res, 400, "Invalid Card!");
        const sql = `UPDATE users_profile SET card_number = ?, is_card_linked = ? WHERE user_id = ? AND id = ?`;
        const VALUES = [null, 0, userId, profileId];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            const userCardSql = `UPDATE user_card SET deactivated_at = ? WHERE user_id = ? AND id = ?`;
            const cardVALUES = [currentDate, userId, cardId];
            const [cardRows] = yield dbV2_1.default.query(userCardSql, cardVALUES);
            return apiResponse.successResponse(res, "Your card is Deactivated!", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to Deactive the card, please try again later !");
        }
        // const sql = `UPDATE user_card SET profile_id = ?, is_card_linked = ? WHERE user_id = ? AND id = ?`;
        // const VALUES = [null, 0, userId, cardId];
        // const [rows]:any =await pool.query(sql, VALUES);
        // if (rows.affectedRows > 0) {
        //     return apiResponse.successResponse(res, "Card removed successfully", null);
        // } else {
        //     return apiResponse.errorMessage(res,400, "Failed, please try again later !");
        // }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.removeCard = removeCard;
// ====================================================================================================
// ====================================================================================================
