import { Request, Response } from "express";
import pool from '../../../../dbV2';
import * as apiResponse from '../../helper/apiResponse';
import config from '../../config/development';
import resMsg from '../../config/responseMsg';

const manageFeatureResMsg = resMsg.features.manageFeature;

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
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, manageFeatureResMsg.getFeatureByUserId.nullUserId);
        if (!profileId || profileId === null) return apiResponse.errorMessage(res, 400, manageFeatureResMsg.getFeatureByUserId.nullProfileId);

        const checkPackageSql = `SELECT * FROM users_package WHERE user_id = ${userId} LIMIT 1`;
        const [packageRows]:any = await pool.query(checkPackageSql);

        let package_name = packageRows[0]?.package_slug ?? null;
        
        let sql = "";
        if (package_name == null) {
            sql = `SELECT users_features.feature_id, features.type, features.icon, features.features, features.slug, users_features.status FROM features LEFT JOIN users_features ON features.id = users_features.feature_id WHERE users_features.user_id = ${userId} AND users_features.profile_id = ${profileId} AND features.status = 1 AND is_business_feature = 0`;
        } else {
            sql = `SELECT users_features.feature_id, features.type, features.icon, features.features, features.slug, users_features.status FROM features LEFT JOIN users_features ON features.id = users_features.feature_id WHERE users_features.user_id = ${userId} AND users_features.profile_id = ${profileId} AND features.status = 1`;
        }
        // const sql = `SELECT users_features.feature_id, features.features, features.slug, users_features.status FROM features LEFT JOIN users_features ON features.id = users_features.feature_id WHERE users_features.user_id = ${userId} AND features.id IN (3, 5, 6, 8, 10, 11)`;

        const [rows]:any = await pool.query(sql);

        const avgFeatureSql = `SELECT users_features.feature_id, features.features, features.slug, users_features.status FROM features LEFT JOIN users_features ON features.id = users_features.feature_id WHERE users_features.user_id = ${userId} AND users_features.profile_id = ${profileId} AND features.status = 1 AND features.id IN (3, 5, 6, 8, 10, 11)`;
        const [avgRows]:any = await pool.query(avgFeatureSql);

        const avgActiveFeature:any = (avgRows.length/6)*100;
        
        // return apiResponse.successResponse(res, "User Features Get Successfully", rows);
        return res.status(200).json({
            status:true,
            data: rows, avgActiveFeature,
            message: manageFeatureResMsg.getFeatureByUserId.successMsg
        })
       
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
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
        if (type && (type === config.businessType || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, manageFeatureResMsg.updateUserFeaturesStatus.nullUserId);
        if (!profileId || profileId === null) return apiResponse.errorMessage(res, 400, manageFeatureResMsg.updateUserFeaturesStatus.nullProfileId);

        let data:any;
        const sql = `UPDATE users_features SET status = ? WHERE user_id = ? AND feature_id = ? AND profile_id = ?`;

        for (const element of req.body.features) {
            const featureId =  element.featureId;
            const status =  element.status;
    
            let VALUES = [status, userId, featureId, profileId];            
            [data] = await pool.query(sql, VALUES);
        }
        
        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, manageFeatureResMsg.updateUserFeaturesStatus.successMsg, null);
        } else {
            return apiResponse.errorMessage(res, 400, manageFeatureResMsg.updateUserFeaturesStatus.failedMsg);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

// get business features (profile setting)
export const features =async (req:Request, res:Response) => {
    try {
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        const profileId = req.query.profileId;
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, manageFeatureResMsg.getFeatureByUserId.nullUserId);
        
        const checkPackageSql = `SELECT * FROM users_package WHERE user_id = ${userId} LIMIT 1`;
        const [packageRows]:any = await pool.query(checkPackageSql);

        let package_name = packageRows[0]?.package_slug ?? null;
        
        let sql = "";
        if (package_name == null) {
            sql = `SELECT * FROM features WHERE feature_show = 1 AND is_business_feature = 0 ORDER BY sequence_id ASC`;    
        } else {
            sql = `SELECT * FROM features WHERE feature_show = 1 ORDER BY sequence_id ASC`;
        }
        const [rows]:any = await pool.query(sql);

        return res.status(200).json({
            status:true,
            data: rows, 
            message: manageFeatureResMsg.features.successMsg
        })
       
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================
