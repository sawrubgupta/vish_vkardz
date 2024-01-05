import { Request, Response } from "express";
import pool from '../../../../dbV2';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';
import resMsg from '../../config/responseMsg';

const galleryResMsg = resMsg.features.gallery;

export const gallary =async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.body.type; //type = business, user, null
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, galleryResMsg.gallary.nullUserId);

        const createdAt = utility.dateWithFormat();
        const { profileId, image } = req.body;
        if (!profileId || profileId === null) return apiResponse.errorMessage(res, 400, "Profile id is required");
        if (!image || image === "" || image === undefined) return apiResponse.errorMessage(res, 400, "Please Upload Image");

        const limitSql = `SELECT * FROM user_limitations WHERE type = '${config.galleryType}' AND status = 1 LIMIT 1`;
        const [limitRows]:any = await pool.query(limitSql);
        const galleryLimit = limitRows[0]?.limitation ?? 50;

        const galleryCountSql = `SELECT COUNT(id) AS totalGallery FROM portfolio WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [galleryCountRows]:any = await pool.query(galleryCountSql);

        if (galleryCountRows[0].totalGallery >= galleryLimit) return apiResponse.errorMessage(res, 400, `Profile limit reached. You can only have a maximum of ${galleryLimit} Images.`);


        const sql = `INSERT INTO portfolio(user_id, profile_id, image, thumb, status, created_at) VALUES(?, ?, ?, ?, ?, ?)`;
        const VALUES = [userId, profileId, image, image, 1, createdAt];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, galleryResMsg.gallary.successMsg, null)
        } else {
            return apiResponse.errorMessage(res, 400, galleryResMsg.gallary.failedMsg);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const getPortfolio =async (req:Request, res:Response) => {
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
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, galleryResMsg.getPortfolio.nullUserId);

        var getPage:any = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page ) {
            page = 1;
        }
        var page_size: any = config.pageSize;       
        const offset = (page - 1 ) * page_size;

        const getPageQuery = `SELECT id, image FROM portfolio WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [result]:any= await pool.query(getPageQuery);

        const sql = `SELECT id, image FROM portfolio WHERE user_id = ${userId} AND profile_id = ${profileId} ORDER BY created_at DESC LIMIT ${page_size} OFFSET ${offset}`;
        const [rows]:any = await pool.query(sql);

        const getFeatureStatus = `SELECT status FROM users_features WHERE user_id = ${userId} AND profile_id = ${profileId} AND feature_id = 8`;
        console.log("getFeatureStatus", getFeatureStatus);
        const [featureRows]:any = await pool.query(getFeatureStatus);
        let featureStatus = featureRows[0]?.status ?? 0;
        // if (featureRows.length > 0) {
            // featureStatus = featureRows[0]?.status ?? 0;
        // } else {
        //     featureStatus = 0;
        // }

        let totalPages:any = result.length/page_size;
        let totalPage = Math.ceil(totalPages);

        if (rows.length > 0) {
            return res.status(200).json({
                status: true,
                data: rows,
                featureStatus: featureStatus,
                totalPage: totalPage,
                currentPage: page,
                totalLength: result.length,
                message: galleryResMsg.getPortfolio.successMsg
            })
        } else {
            return res.status(200).json({
                status: true,
                data: null,
                featureStatus: featureStatus,
                totalPage: totalPage,
                currentPage: page,
                totalLength: result.length,
                message: galleryResMsg.getPortfolio.noDataFoundMsg
            })
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
} 

// ====================================================================================================
// ====================================================================================================

export const deleteImage =async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.body.type; //type = business, user, null
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, galleryResMsg.deleteImage.nullUserId);

        const portfolioId = req.body.portfolioId;

        const sql = `DELETE FROM portfolio WHERE user_id = ${userId} AND id IN (${portfolioId})`;
        const [rows]:any = await pool.query(sql);

        return apiResponse.successResponse(res, galleryResMsg.deleteImage.successMsg, null);
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================
