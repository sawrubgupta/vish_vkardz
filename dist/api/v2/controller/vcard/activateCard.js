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
exports.multiProfileActivateCard = exports.activateCard = void 0;
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const utility = __importStar(require("../../helper/utility"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const development_1 = __importDefault(require("../../config/development"));
//not used
const activateCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId;
        const type = req.body.type; //type = business, user, null
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.body.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (userId === undefined || !userId)
            return apiResponse.errorMessage(res, 400, "Please re-login!!");
        const justDate = utility.dateWithFormat();
        const endDate = utility.extendedDateWithFormat("yearly");
        let featureStatus;
        let featureResult;
        const { profileId, code } = req.body;
        const splitCode = code.split(development_1.default.vcardLink);
        let newCardNum = splitCode[1] || '';
        let splitNewCardNumber = newCardNum.split('/');
        let newCardNumber = splitNewCardNumber[0] || newCardNum;
        if (!code)
            return apiResponse.errorMessage(res, 400, "Card number is invalid !");
        const getCardDetail = `SELECT * FROM card_activation where card_key = '${code}' OR card_number = '${code}' OR card_number = '${newCardNumber}' limit 1`;
        const [cardData] = yield dbV2_1.default.query(getCardDetail);
        if (cardData.length === 0) {
            return apiResponse.errorMessage(res, 400, "Code is invalid, Contact support!");
        }
        const card_number = cardData[0].card_number;
        const packageId = cardData[0].package_type; //account_type
        const packageSlug = cardData[0].package_slug;
        const profileSql = `Select * from users_profile where id = ${profileId} LIMIT 1`;
        const [profileRows] = yield dbV2_1.default.query(profileSql);
        if ((profileRows.card_number != null || profileRows.card_number != "") && (profileRows.card_number_fix != null || profileRows.card_number_fix != ""))
            return apiResponse.errorMessage(res, 400, "There is already a card link on this profile");
        const checkCardQuery = `Select * from users_profile where card_number = '${card_number}' OR card_number_fix = '${card_number}' limit 1`;
        const [checkCardData] = yield dbV2_1.default.query(checkCardQuery);
        if (checkCardData.length > 0) {
            return apiResponse.errorMessage(res, 400, "The code is already used by someone");
        }
        else {
            const checkPackageQuery = `Select * from features_type where status = 1 && id = ${packageId}`;
            const [packageFound] = yield dbV2_1.default.query(checkPackageQuery);
            if (packageFound.length > 0) {
                const addCardDataQuery = `UPDATE users_profile SET is_card_linked = ?, card_number = ?, account_type = ?, package_name = ?, start_date = ?, is_expired = ?, expired_at = ? WHERE user_id = ? AND id = ?`;
                const VALUES = [1, card_number, packageId, packageSlug, justDate, 0, endDate, userId, profileId];
                const [addCardRows] = yield dbV2_1.default.query(addCardDataQuery, VALUES);
                if (addCardRows.affectedRows > 0) {
                    // const getFeatures = `SELECT * FROM features WHERE status = 1`
                    // const [featureData]:any = await pool.query(getFeatures);
                    // const deleteFeatureQuery = `delete from users_features WHERE user_id = ${userId} AND profile_id = ${profileId}`;
                    // const [deleteRows]:any = await pool.query(deleteFeatureQuery);
                    // if (deleteRows.affectedRows > 0) {
                    //     let addFeatures:any = `INSERT INTO users_features (feature_id, user_id, profile_id, status) VALUES`;
                    //     await featureData.forEach(async (element: any) => {
                    //         // if (packageId === 18) {
                    //         //     if (element.id === 1 || element.id === 2 || element.id === 3 || element.id === 5 || element.id === 6 || element.id === 8 || element.id === 10 ||element.id === 11 || element.id === 13 || element.id === 14 || element.id === 15) {
                    //         //         featureStatus = 1;
                    //         //     } else {
                    //         //         featureStatus = 0;
                    //         //     }
                    //         // } else {
                    //         //     if (element.id === 1 || element.id === 2 || element.id === 13 || element.id === 14 || element.id === 15) {
                    //         //         featureStatus = 1;
                    //         //     } else {
                    //         //         featureStatus = 0;
                    //         //     }
                    //         // }
                    //         if (element.id === 1 || element.id === 2 || element.id === 13 || element.id === 14 || element.id === 15 || (element.id >= 18)) {
                    //             featureStatus = 1;
                    //         } else {
                    //             featureStatus = 0;
                    //         }
                    //         addFeatures = addFeatures + `(${element.id},${userId},${profileId}${featureStatus}), `;
                    //         featureResult = addFeatures.substring(0,addFeatures.lastIndexOf(','));
                    //     })
                    //     const [userFeatureData]:any = await pool.query(featureResult)
                    // if (userFeatureData.affectedRows > 0) {
                    const updateCodeStatus = `UPDATE card_activation SET card_assign = '${development_1.default.ASSIGNEDStatus}' WHERE card_key = '${code}'`;
                    const [cardRows] = yield dbV2_1.default.query(updateCodeStatus);
                    return apiResponse.successResponse(res, "Congratulations, Your card is Actived Now!", null);
                    // } else {
                    //     return apiResponse.errorMessage(res, 400, "Failed to add features, Contact Support");
                    // }
                    // } else {
                    //     return apiResponse.errorMessage(res, 400, "Contact Support!!")
                    // }
                }
                else {
                    return apiResponse.errorMessage(res, 400, "Failed to activate the card profile, Please try again !");
                }
            }
            else {
                return apiResponse.errorMessage(res, 400, "Package not found!");
            }
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.activateCard = activateCard;
// ====================================================================================================
// ====================================================================================================
//multiple profile card activation with multiple card link 
const multiProfileActivateCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId;
        const type = req.body.type; //type = business, user, null
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.body.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (userId === undefined || !userId)
            return apiResponse.errorMessage(res, 400, "Please re-login!!");
        const justDate = utility.dateWithFormat();
        const endDate = utility.extendedDateWithFormat("yearly");
        let { profileId, code, productType } = req.body;
        // if (profileId === 0)
        const splitCode = code.split(development_1.default.vcardLink);
        let newCardNum = splitCode[1] || '';
        let splitNewCardNumber = newCardNum.split('/');
        let newCardNumber = splitNewCardNumber[0] || newCardNum;
        if (!code)
            return apiResponse.errorMessage(res, 400, "Card number is invalid !");
        const getCardDetail = `SELECT * FROM card_activation where card_key = '${code}' OR card_number = '${code}' OR card_number = '${newCardNumber}' limit 1`;
        const [cardData] = yield dbV2_1.default.query(getCardDetail);
        if (cardData.length === 0) {
            return apiResponse.errorMessage(res, 400, "Code is invalid, Contact support!");
        }
        const card_number = cardData[0].card_number;
        const packageId = cardData[0].package_type; //account_type
        const packageSlug = cardData[0].package_slug;
        // const profileSql = `Select * from users_profile where id = ${profileId} LIMIT 1`;
        // const [profileRows]: any = await pool.query(profileSql);
        // if ((profileRows.card_number != null || profileRows.card_number != "") && (profileRows.card_number_fix != null || profileRows.card_number_fix != "")) return apiResponse.errorMessage(res, 400, "There is already a card link on this profile");
        const checkCardNumberSql = `SELECT * FROM user_card WHERE deactivated_at IS NULL AND (card_number = '${card_number}' OR card_number_fix = '${card_number}') limit 1`;
        const [cardNumberRows] = yield dbV2_1.default.query(checkCardNumberSql);
        if (cardNumberRows.length > 0)
            return apiResponse.errorMessage(res, 400, "The code is already used by someone!");
        const checkCardQuery = `Select * from users_profile where deleted_at IS NULL AND is_card_linked = 1 AND (card_number = '${card_number}' OR card_number_fix = '${card_number}') limit 1`;
        const [checkCardData] = yield dbV2_1.default.query(checkCardQuery);
        if (checkCardData.length > 0) {
            return apiResponse.errorMessage(res, 400, "The code is already used by someone!");
        }
        else {
            const checkPackageQuery = `Select * from features_type where status = 1 && id = ${packageId}`;
            const [packageFound] = yield dbV2_1.default.query(checkPackageQuery);
            if (packageFound.length > 0) {
                // const addCardDataQuery = `UPDATE users_profile SET is_card_linked = ?, card_number = ?, account_type = ?, package_name = ? WHERE user_id = ? AND id = ?`;
                // const VALUES = [1, card_number, packageId, packageSlug, userId, profileId];
                const addCardDataQuery = `UPDATE users_profile SET is_card_linked = ? WHERE user_id = ? AND id = ?`;
                const VALUES = [1, userId, profileId];
                const [addCardRows] = yield dbV2_1.default.query(addCardDataQuery, VALUES);
                if (addCardRows.affectedRows > 0) {
                    const insertCardData = `INSERT INTO user_card(user_id, profile_id, product_type, card_number, is_card_linked, created_at) VALUES(?, ?, ?, ?, ?, ?)`;
                    const cardVALUES = [userId, profileId, productType, card_number, 1, justDate];
                    const [cardRrows] = yield dbV2_1.default.query(insertCardData, cardVALUES);
                    // const getFeatures = `SELECT * FROM features WHERE status = 1`
                    // const [featureData]:any = await pool.query(getFeatures);
                    // const deleteFeatureQuery = `delete from users_features WHERE user_id = ${userId} AND profile_id = ${profileId}`;
                    // const [deleteRows]:any = await pool.query(deleteFeatureQuery);
                    // if (deleteRows.affectedRows > 0) {
                    //     let addFeatures:any = `INSERT INTO users_features (feature_id, user_id, profile_id, status) VALUES`;
                    //     await featureData.forEach(async (element: any) => {
                    //         // if (packageId === 18) {
                    //         //     if (element.id === 1 || element.id === 2 || element.id === 3 || element.id === 5 || element.id === 6 || element.id === 8 || element.id === 10 ||element.id === 11 || element.id === 13 || element.id === 14 || element.id === 15) {
                    //         //         featureStatus = 1;
                    //         //     } else {
                    //         //         featureStatus = 0;
                    //         //     }
                    //         // } else {
                    //         //     if (element.id === 1 || element.id === 2 || element.id === 13 || element.id === 14 || element.id === 15) {
                    //         //         featureStatus = 1;
                    //         //     } else {
                    //         //         featureStatus = 0;
                    //         //     }
                    //         // }
                    //         if (element.id === 1 || element.id === 2 || element.id === 13 || element.id === 14 || element.id === 15 || (element.id >= 18)) {
                    //             featureStatus = 1;
                    //         } else {
                    //             featureStatus = 0;
                    //         }
                    //         addFeatures = addFeatures + `(${element.id},${userId},${profileId}${featureStatus}), `;
                    //         featureResult = addFeatures.substring(0,addFeatures.lastIndexOf(','));
                    //     })
                    //     const [userFeatureData]:any = await pool.query(featureResult)
                    // if (userFeatureData.affectedRows > 0) {
                    const updateCodeStatus = `UPDATE card_activation SET card_assign = '${development_1.default.ASSIGNEDStatus}' WHERE card_key = '${code}'`;
                    const [cardRows] = yield dbV2_1.default.query(updateCodeStatus);
                    return apiResponse.successResponse(res, "Congratulations, Your card is Actived Now!", null);
                    // } else {
                    //     return apiResponse.errorMessage(res, 400, "Failed to add features, Contact Support");
                    // }
                    // } else {
                    //     return apiResponse.errorMessage(res, 400, "Contact Support!!")
                    // }
                }
                else {
                    return apiResponse.errorMessage(res, 400, "Failed to activate the card profile, Please try again !");
                }
            }
            else {
                return apiResponse.errorMessage(res, 400, "Package not found!");
            }
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.multiProfileActivateCard = multiProfileActivateCard;
// ====================================================================================================
// ====================================================================================================
