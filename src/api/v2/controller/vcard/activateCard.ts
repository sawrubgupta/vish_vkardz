import { Request, Response, NextFunction } from "express";
import pool from '../../../../dbV2';
import * as utility from "../../helper/utility";
import * as apiResponse from '../../helper/apiResponse';
import config from '../../config/development';

//not used
export const activateCard = async (req: Request, res: Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId: any;
        const type = req.body.type; //type = business, user, null
        if (type && (type === config.businessType || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }

        if (userId === undefined || !userId) return apiResponse.errorMessage(res, 400, "Please re-login!!")

        const justDate = utility.dateWithFormat();
        const endDate = utility.extendedDateWithFormat("yearly");
        let featureStatus;
        let featureResult: any;

        const { profileId, code } = req.body;

        const splitCode = code.split(config.vcardLink);
        let newCardNum: any = splitCode[1] || '';

        let splitNewCardNumber = newCardNum.split('/');
        let newCardNumber = splitNewCardNumber[0] || newCardNum;

        if (!code) return apiResponse.errorMessage(res, 400, "Card number is invalid !");

        const getCardDetail = `SELECT * FROM card_activation where card_key = '${code}' OR card_number = '${code}' OR card_number = '${newCardNumber}' limit 1`;
        const [cardData]: any = await pool.query(getCardDetail);
        if (cardData.length === 0) {
            return apiResponse.errorMessage(res, 400, "Code is invalid, Contact support!");
        }
        const card_number = cardData[0].card_number;
        const packageId = cardData[0].package_type; //account_type
        const packageSlug = cardData[0].package_slug;

        const profileSql = `Select * from users_profile where id = ${profileId} LIMIT 1`;
        const [profileRows]: any = await pool.query(profileSql);
        if ((profileRows.card_number != null || profileRows.card_number != "") && (profileRows.card_number_fix != null || profileRows.card_number_fix != "")) return apiResponse.errorMessage(res, 400, "There is already a card link on this profile");

        const checkCardQuery = `Select * from users_profile where card_number = '${card_number}' OR card_number_fix = '${card_number}' limit 1`;
        const [checkCardData]: any = await pool.query(checkCardQuery);

        if (checkCardData.length > 0) {
            return apiResponse.errorMessage(res, 400, "The code is already used by someone");
        } else {
            const checkPackageQuery = `Select * from features_type where status = 1 && id = ${packageId}`;
            const [packageFound]: any = await pool.query(checkPackageQuery);
            if (packageFound.length > 0) {
                const addCardDataQuery = `UPDATE users_profile SET is_card_linked = ?, card_number = ?, account_type = ?, package_name = ?, start_date = ?, is_expired = ?, expired_at = ? WHERE user_id = ? AND id = ?`;
                const VALUES = [1, card_number, packageId, packageSlug, justDate, 0, endDate, userId, profileId];
                const [addCardRows]: any = await pool.query(addCardDataQuery, VALUES);

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
                    const updateCodeStatus = `UPDATE card_activation SET card_assign = '${config.ASSIGNEDStatus}' WHERE card_key = '${code}'`;
                    const [cardRows]: any = await pool.query(updateCodeStatus);

                    return apiResponse.successResponse(res, "Congratulations, Your card is Actived Now!", null);
                    // } else {
                    //     return apiResponse.errorMessage(res, 400, "Failed to add features, Contact Support");
                    // }

                    // } else {
                    //     return apiResponse.errorMessage(res, 400, "Contact Support!!")
                    // }
                } else {
                    return apiResponse.errorMessage(res, 400, "Failed to activate the card profile, Please try again !");
                }
            } else {
                return apiResponse.errorMessage(res, 400, "Package not found!");
            }
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

//multiple profile card activation with multiple card link 
export const multiProfileActivateCard = async (req: Request, res: Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId: any;
        const type = req.body.type; //type = business, user, null
        if (type && (type === config.businessType || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (userId === undefined || !userId) return apiResponse.errorMessage(res, 400, "Please re-login!!")

        const justDate = utility.dateWithFormat();
        const endDate = utility.extendedDateWithFormat("yearly");

        let { profileId, code, productType } = req.body;
        // if (profileId === 0)
        
        const splitCode = code.split(config.vcardLink);
        let newCardNum: any = splitCode[1] || '';

        let splitNewCardNumber = newCardNum.split('/');
        let newCardNumber = splitNewCardNumber[0] || newCardNum;

        if (!code) return apiResponse.errorMessage(res, 400, "Card number is invalid !");

        const getCardDetail = `SELECT * FROM card_activation where card_key = '${code}' OR card_number = '${code}' OR card_number = '${newCardNumber}' limit 1`;
        const [cardData]: any = await pool.query(getCardDetail);
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
        const [cardNumberRows]:any = await pool.query(checkCardNumberSql);
        if (cardNumberRows.length > 0) return apiResponse.errorMessage(res, 400, "The code is already used by someone!");

        const checkCardQuery = `Select * from users_profile where deleted_at IS NULL AND is_card_linked = 1 AND (card_number = '${card_number}' OR card_number_fix = '${card_number}') limit 1`;
        const [checkCardData]: any = await pool.query(checkCardQuery);

        if (checkCardData.length > 0) {
            return apiResponse.errorMessage(res, 400, "The code is already used by someone!");
        } else {
            const checkPackageQuery = `Select * from features_type where status = 1 && id = ${packageId}`;
            const [packageFound]: any = await pool.query(checkPackageQuery);
            if (packageFound.length > 0) {
                // const addCardDataQuery = `UPDATE users_profile SET is_card_linked = ?, card_number = ?, account_type = ?, package_name = ? WHERE user_id = ? AND id = ?`;
                // const VALUES = [1, card_number, packageId, packageSlug, userId, profileId];
                const addCardDataQuery = `UPDATE users_profile SET is_card_linked = ? WHERE user_id = ? AND id = ?`;
                const VALUES = [1, userId, profileId];
                const [addCardRows]: any = await pool.query(addCardDataQuery, VALUES);

                if (addCardRows.affectedRows > 0) {

                    const insertCardData = `INSERT INTO user_card(user_id, profile_id, product_type, card_number, is_card_linked, created_at) VALUES(?, ?, ?, ?, ?, ?)`;
                    const cardVALUES = [userId, profileId, productType, card_number, 1, justDate];
                    const [cardRrows]:any = await pool.query(insertCardData, cardVALUES);

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
                    const updateCodeStatus = `UPDATE card_activation SET card_assign = '${config.ASSIGNEDStatus}' WHERE card_key = '${code}'`;
                    const [cardRows]: any = await pool.query(updateCodeStatus);

                    return apiResponse.successResponse(res, "Congratulations, Your card is Actived Now!", null);
                    // } else {
                    //     return apiResponse.errorMessage(res, 400, "Failed to add features, Contact Support");
                    // }

                    // } else {
                    //     return apiResponse.errorMessage(res, 400, "Contact Support!!")
                    // }
                } else {
                    return apiResponse.errorMessage(res, 400, "Failed to activate the card profile, Please try again !");
                }
            } else {
                return apiResponse.errorMessage(res, 400, "Package not found!");
            }
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
