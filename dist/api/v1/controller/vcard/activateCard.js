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
exports.activateCard = void 0;
const db_1 = __importDefault(require("../../../../db"));
const utility = __importStar(require("../../helper/utility"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const development_1 = __importDefault(require("../../config/development"));
const activateCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId;
        const type = req.query.type; //type = business, user, null
        if (type && type === development_1.default.businessType) {
            userId = req.query.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        // if (!userId || userId === "" || userId === undefined) {
        //     return apiResponse.errorMessage(res, 401, "User Id is required!");
        // }
        if (userId === undefined || !userId) {
            return apiResponse.errorMessage(res, 400, "Please re-login!!");
        }
        const justDate = utility.dateWithFormat();
        const endDate = utility.extendedDateWithFormat("yearly");
        let featureStatus;
        let featureResult;
        const { username, code } = req.body;
        if (!code) {
            return apiResponse.errorMessage(res, 400, "Card number is invalid !");
        }
        const getCardDetail = `SELECT * FROM card_activation where card_key = '${code}' limit 1`;
        const [cardData] = yield db_1.default.query(getCardDetail);
        if (cardData.length === 0) {
            return apiResponse.errorMessage(res, 400, "Code is invalid, Contact support!");
        }
        const card_number = cardData[0].card_number;
        const packageId = cardData[0].package_type; //account_type
        const checkCardQuery = `Select * from users where card_number = '${card_number}' OR card_number_fix = '${card_number}' limit 1`;
        const [checkCardData] = yield db_1.default.query(checkCardQuery);
        if (checkCardData.length > 0) {
            return apiResponse.errorMessage(res, 400, "The code is already used by someone!");
        }
        else {
            const checkPackageQuery = `Select * from features_type where status = 1 && id = ${packageId}`;
            const [packageFound] = yield db_1.default.query(checkPackageQuery);
            if (packageFound.length > 0) {
                const addCardDataQuery = `UPDATE users SET is_deactived = ?, is_expired = ?, is_card_linked = ?, is_active = ?, is_verify = ?, is_payment = ?, card_number = ?, account_type = ?, verify_time = ?, start_date = ?, end_date = ? WHERE id = ?`;
                const VALUES = [0, 0, 1, 1, 1, 1, card_number, packageId, justDate, justDate, endDate, userId];
                const [addCardRows] = yield db_1.default.query(addCardDataQuery, VALUES);
                if (addCardRows.affectedRows > 0) {
                    const getFeatures = `SELECT * FROM features WHERE status = 1`;
                    const [featureData] = yield db_1.default.query(getFeatures);
                    const deleteFeatureQuery = `delete from users_features WHERE user_id = ${userId}`;
                    const [deleteRows] = yield db_1.default.query(deleteFeatureQuery);
                    if (deleteRows.affectedRows > 0) {
                        let addFeatures = `INSERT INTO users_features (feature_id, user_id, status) VALUES`;
                        yield featureData.forEach((element) => __awaiter(void 0, void 0, void 0, function* () {
                            if (packageId === 18) {
                                if (element.id === 1 || element.id === 2 || element.id === 3 || element.id === 5 || element.id === 6 || element.id === 8 || element.id === 10 || element.id === 11 || element.id === 13 || element.id === 14 || element.id === 15) {
                                    featureStatus = 1;
                                }
                                else {
                                    featureStatus = 0;
                                }
                            }
                            else {
                                if (element.id === 1 || element.id === 2 || element.id === 13 || element.id === 14 || element.id === 15) {
                                    featureStatus = 1;
                                }
                                else {
                                    featureStatus = 0;
                                }
                            }
                            addFeatures = addFeatures + `(${element.id},${userId},${featureStatus}), `;
                            featureResult = addFeatures.substring(0, addFeatures.lastIndexOf(','));
                        }));
                        const [userFeatureData] = yield db_1.default.query(featureResult);
                        if (userFeatureData.affectedRows > 0) {
                            const updateCodeStatus = `UPDATE card_activation SET card_assign = '${development_1.default.ASSIGNEDStatus}' WHERE card_key = '${code}'`;
                            const [cardRows] = yield db_1.default.query(updateCodeStatus);
                            return apiResponse.successResponse(res, "Congratulations, Your card is Actived Now!", null);
                        }
                        else {
                            return apiResponse.errorMessage(res, 400, "Failed to add features, Contact Support");
                        }
                    }
                    else {
                        return apiResponse.errorMessage(res, 400, "Contact Support!!");
                    }
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
