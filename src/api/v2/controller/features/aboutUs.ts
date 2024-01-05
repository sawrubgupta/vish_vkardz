import { Request, Response } from "express";
import pool from '../../../../dbV2';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config from '../../config/development';
import resMsg from '../../config/responseMsg';

const featuresResMsg = resMsg.features.aboutUs;

export const addUpdateAboutUs =async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.body.type; //type = business, user, null
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, featuresResMsg.addUpdateAboutUs.nullUserId);

        const createdAt = utility.dateWithFormat();
        const { companyName, year, business, aboutUsDetail, image, coverImage, profileId, document } = req.body;

        const checkProfile = `SELECT id FROM users_profile WHERE user_id = ${userId} AND id = ${profileId} LIMIT 1`;
        const [profileRows]:any = await pool.query(checkProfile);
        if (profileRows.length === 0) return apiResponse.errorMessage(res, 400, featuresResMsg.addUpdateAboutUs.profileNotExist);

        const getAboutUs = `SELECT id FROM about WHERE user_id = ${userId} AND profile_id = ${profileId} LIMIT 1`;
        const [aboutUsRows]:any = await pool.query(getAboutUs);

        if (aboutUsRows.length > 0) {
            const updateQuery = `UPDATE about SET company_name = ?, year = ?, business = ?, about_detail = ?, images = ?, cover_image = ?, document = ? WHERE user_id = ? AND profile_id = ?`;
            const VALUES = [companyName, year, business, aboutUsDetail, image, coverImage, document, userId, profileId];
            const [updatedRows]:any = await pool.query(updateQuery, VALUES);

            if (updatedRows.affectedRows > 0) {
                return apiResponse.successResponse(res, featuresResMsg.addUpdateAboutUs.successUpdateMsg, null);
            } else {
                return apiResponse.errorMessage(res, 400, featuresResMsg.addUpdateAboutUs.failedMsg);
            }
        } else {
            const insertedQuery = `INSERT INTO about(user_id, profile_id, company_name, business, year, about_detail, images, cover_image, document, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const insertVALUES = [userId, profileId, companyName, business, year, aboutUsDetail, image, coverImage, document, createdAt];
            const [insertedRows]:any = await pool.query(insertedQuery, insertVALUES);

            if (insertedRows.affectedRows > 0) {
                return apiResponse.successResponse(res, featuresResMsg.addUpdateAboutUs.successInsertMsg, null);
            } else {
                return apiResponse.errorMessage(res, 400, featuresResMsg.addUpdateAboutUs.failedMsg);
            }
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const getAboutUs =async (req:Request, res:Response) => {
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
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, featuresResMsg.getAboutUs.nullUserId);

        const sql = `SELECT id, company_name, business, year, about_detail, images, cover_image, created_at, document FROM about WHERE user_id = ${userId} AND profile_id = ${profileId} LIMIT 1`;
        const [rows]:any = await pool.query(sql);

        const getFeatureStatus = `SELECT status FROM users_features WHERE user_id = ${userId} AND profile_id = ${profileId} AND feature_id = 3 LIMIT 1`;
        const [featureStatusRRows]:any = await pool.query(getFeatureStatus);
        let featureStatus = featureStatusRRows[0].status;

        if (rows.length > 0) {    
            rows[0].featureStatus = featureStatus;
            return apiResponse.successResponse(res, featuresResMsg.getAboutUs.successMsg, rows[0]);
        } else {
            // return apiResponse.successResponse(res, "No Data Found", null)
            return res.status(200).json({
                status: true,
                data: null, featureStatus,
                message: featuresResMsg.getAboutUs.noDataFoundMsg
            })
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const deleteAboutUs =async (req:Request, res:Response) => {
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
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, featuresResMsg.deleteAboutUs.nullUserId);

        const sql = `DELETE FROM about WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [rows]:any = await pool.query(sql);

        return apiResponse.successResponse(res, featuresResMsg.deleteAboutUs.successMsg, null);
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================
