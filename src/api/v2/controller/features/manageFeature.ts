import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import config from '../../config/development';

export const getFeatureByUserId =async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        const profileId = req.query.profileId;
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, "User Id is required!");
        if (!profileId || profileId === null) return apiResponse.errorMessage(res, 400, "Profile id is required");

        // const sql = `SELECT users_features.feature_id, features.features, features.slug, users_features.status FROM features LEFT JOIN users_features ON features.id = users_features.feature_id WHERE users_features.user_id = ${userId} AND features.id IN (3, 5, 6, 8, 10, 11)`;
        const sql = `SELECT users_features.feature_id, features.features, features.slug, users_features.status FROM features LEFT JOIN users_features ON features.id = users_features.feature_id WHERE users_features.user_id = ${userId} AND users_features.profile_id = ${profileId} AND features.feature_show = 1`;
        const [rows]:any = await pool.query(sql);

        const avgFeatureSql = `SELECT users_features.feature_id, features.features, features.slug, users_features.status FROM features LEFT JOIN users_features ON features.id = users_features.feature_id WHERE users_features.user_id = ${userId} AND users_features.profile_id = ${profileId} AND features.feature_show = 1`;
        const [avgRows]:any = await pool.query(avgFeatureSql);

        const avgActiveFeature:any = (avgRows.length/6)*100;
        
        // return apiResponse.successResponse(res, "User Features Get Successfully", rows);
        return res.status(200).json({
            status:true,
            data: rows, avgActiveFeature,
            message: "User Features Get Successfully"
        })
       
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const updateUserFeaturesStatus =async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.body.type; //type = business, user, null
        const profileId = req.body.profileId;
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "User Id is required!");
        }

        let data:any;
        const sql = `UPDATE users_features SET status = ? WHERE user_id = ? AND feature_id = ? AND profile_id = ?`;

        for await (const element of req.body.features) {
            const featureId =  element.featureId;
            const status =  element.status;
    
            let VALUES = [status, userId, featureId, profileId];            
            [data] = await pool.query(sql, VALUES);
        }
        
        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Features updated successfully", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to update user feature, try again");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// =======w============================================================================================
// ====================================================================================================

export const features =async (req:Request, res:Response) => {
    try {
        
        const sql = `SELECT * FROM features WHERE feature_show = 1`;
        const [rows]:any = await pool.query(sql);

        return res.status(200).json({
            status:true,
            data: rows, 
            message: "User Features Get Successfully"
        })
       
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
