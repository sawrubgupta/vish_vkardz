import  { Request, Response, NextFunction } from "express";
import pool from '../../../../db';
import * as utility from "../../helper/utility";
import * as apiResponse from '../../helper/apiResponse';

export const activateCard =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        if (userId === undefined || !userId) {
            return apiResponse.errorMessage(res, 400, "Please re-login!!")
        }
        const justDate = utility.dateWithFormat();
        const endDate = utility.extendedDateWithFormat("yearly");
        let featureStatus;
        let featureResult:any;

        const { username, code } = req.body;
        if (!code) {
            return apiResponse.errorMessage(res, 400, "Card number is invalid !");
        }
        const getCardDetail = `SELECT * FROM card_activation where card_key = '${code}' limit 1`;
        const [cardData]:any = await pool.query(getCardDetail);
        if (cardData.length === 0) {
            return apiResponse.errorMessage(res, 400, "Code is invalid, Contact support!");
        }
        const card_number = cardData[0].card_number;
        const packageId = cardData[0].package_type; //account_type

        const checkCardQuery = `Select * from users where card_number = '${card_number}' OR card_number_fix = '${card_number}' limit 1`;
        const [checkCardData]:any = await pool.query(checkCardQuery);

        if (checkCardData.length > 0) {
            return apiResponse.errorMessage(res, 400, "The code is already used by someone!");
        } else {
            const checkPackageQuery = `Select * from features_type where status = 1 && id = ${packageId}`;
            const [packageFound]:any = await pool.query(checkPackageQuery);
            if (packageFound.length > 0) {
                const addCardDataQuery = `UPDATE users SET is_deactived = ?, is_active = ?, is_verify = ?, is_payment = ?, card_number = ?, account_type = ?, verify_time = ?, start_date = ?, end_date = ? WHERE id = ?`;
                const VALUES = [0, 1, 1, 1, card_number, packageId, justDate, justDate, endDate, userId];
                const [addCardRows]:any = await pool.query(addCardDataQuery, VALUES);

                if (addCardRows.affectedRows > 0) {
                    const getFeatures = `SELECT * FROM features WHERE status = 1`
                    const [featureData]:any = await pool.query(getFeatures);

                    const deleteFeatureQuery = `delete from users_features WHERE user_id = ${userId}`;
                    const [deleteRows]:any = await pool.query(deleteFeatureQuery);

                    if (deleteRows.affectedRows > 0) {
                        let addFeatures:any = `INSERT INTO users_features (feature_id, user_id, status) VALUES`;
                        await featureData.forEach(async (element: any) => {
                            if (packageId === 18) {
                                if (element.id === 1 || element.id === 2 || element.id === 3 || element.id === 5 || element.id === 6 || element.id === 8 || element.id === 10 ||element.id === 11 || element.id === 13 || element.id === 14 || element.id === 15) {
                                    featureStatus = 1;
                                } else {
                                    featureStatus = 0;
                                }
                            } else {
                                if (element.id === 1 || element.id === 2 || element.id === 13 || element.id === 14 || element.id === 15) {
                                    featureStatus = 1;
                                } else {
                                    featureStatus = 0;
                                }
                            }
                            addFeatures = addFeatures + `(${element.id},${userId},${featureStatus}), `;
                            featureResult = addFeatures.substring(0,addFeatures.lastIndexOf(','));
                        })
                        const [userFeatureData]:any = await pool.query(featureResult)
                        if (userFeatureData.affectedRows > 0) {
                            return apiResponse.successResponse(res, "Congratulations, Your card is Actived Now!", null);
                        } else {
                            return apiResponse.errorMessage(res, 400, "Failed to add features, Contact Support");
                        }

                    } else {
                        return apiResponse.errorMessage(res, 400, "Contact Support!!")
                    }
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
