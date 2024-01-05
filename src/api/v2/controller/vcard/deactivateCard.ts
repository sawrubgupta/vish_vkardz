import { Request, Response, NextFunction } from "express";
import pool from '../../../../dbV2';
import * as apiResponse from '../../helper/apiResponse';
import config from '../../config/development';
import * as utility from "../../helper/utility";

//not used
export const deactivateCard =async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId:any; 
        const currentDate = utility.dateWithFormat();
        const type = req.query.type; //type = business, user, null
        const profileId = req.query.profileId;
        console.log("profileId", profileId);
        
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, "User Id is required!");
        if (!profileId || profileId === null) return apiResponse.errorMessage(res, 400, "Profile id is required");

        const sql = `UPDATE users_profile SET is_card_linked = ? WHERE user_id = ? AND id = ?`;
        const VALUES = [0, userId, profileId];
        const [rows]:any =await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            const userCardSql = `UPDATE user_card SET deactivated_at = ? WHERE user_id = ? AND profile_id = ?`;
            const cardVALUES = [currentDate, userId, profileId];
            const [cardRows]:any = await pool.query(userCardSql, cardVALUES);

            return apiResponse.successResponse(res, "Your card is Deactivated!", null);
        } else {
            return apiResponse.errorMessage(res,400, "Failed to Deactive the card, please try again later !");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong")
    }
}

// ====================================================================================================
// ====================================================================================================

export const removeCard =async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.body.type; //type = business, user, null
        const profileId = req.body.profileId;
        const cardId = req.body.cardId;
        const currentDate = utility.dateWithFormat();

        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, "User Id is required!");
        // if (!profileId || profileId === null) return apiResponse.errorMessage(res, 400, "Profile id is required");
        if (!cardId || cardId === null) return apiResponse.errorMessage(res, 400, "cardId is required");

        const cardSql = `SELECT * FROM user_card WHERE user_id = ${userId} AND id = ${cardId} LIMIT 1`;
        const [cardRows]:any = await pool.query(cardSql);
        if(cardRows.length === 0) return apiResponse.errorMessage(res, 400, "Invalid Card!");

        const sql = `UPDATE users_profile SET card_number = ?, is_card_linked = ? WHERE user_id = ? AND id = ?`;
        const VALUES = [null, 0, userId, profileId];
        const [rows]:any =await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            const userCardSql = `UPDATE user_card SET deactivated_at = ? WHERE user_id = ? AND id = ?`;
            const cardVALUES = [currentDate, userId, cardId];
            const [cardRows]:any = await pool.query(userCardSql, cardVALUES);

            return apiResponse.successResponse(res, "Your card is Deactivated!", null);
        } else {
            return apiResponse.errorMessage(res,400, "Failed to Deactive the card, please try again later !");
        }

        // const sql = `UPDATE user_card SET profile_id = ?, is_card_linked = ? WHERE user_id = ? AND id = ?`;
        // const VALUES = [null, 0, userId, cardId];
        // const [rows]:any =await pool.query(sql, VALUES);

        // if (rows.affectedRows > 0) {
        //     return apiResponse.successResponse(res, "Card removed successfully", null);
        // } else {
        //     return apiResponse.errorMessage(res,400, "Failed, please try again later !");
        // }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong")
    }
}

// ====================================================================================================
// ====================================================================================================
