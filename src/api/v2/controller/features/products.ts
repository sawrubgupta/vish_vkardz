import { Request, Response } from "express";
import pool from '../../../../dbV2';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';
import resMsg from '../../config/responseMsg';

const productsResMsg = resMsg.features.products;

export const addProduct =async (req:Request, res:Response) => {
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
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, productsResMsg.addProducts.nullUserId);
        if (!profileId || profileId === null) return apiResponse.errorMessage(res, 400, productsResMsg.addProducts.nullProfileId);

        const createdAt = utility.dateWithFormat();
        const {title, description, price, image, currencyCode} = req.body;

        const limitSql = `SELECT * FROM user_limitations WHERE type = '${config.productType}' AND status = 1 LIMIT 1`;
        const [limitRows]:any = await pool.query(limitSql);
        const productLimit = limitRows[0]?.limitation ?? 50;

        const productCountSql = `SELECT COUNT(id) AS totalProduct FROM services WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [productCountRows]:any = await pool.query(productCountSql);

        if (productCountRows[0].totalProduct >= productLimit) return apiResponse.errorMessage(res, 400, `Profile limit reached. You can only have a maximum of ${productLimit} Products.`);

        const sql = `INSERT INTO services(user_id, profile_id, title, images, overview, price, currency_code, status, created_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const VALUES = [userId, profileId, title, image, description, price, currencyCode, 1, createdAt];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, productsResMsg.addProducts.successMsg, null);
        } else {
            return apiResponse.errorMessage(res, 400, productsResMsg.addProducts.failedMsg);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const getProducts =async (req:Request, res:Response) => {
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
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, productsResMsg.getProducts.nullUserId);
        if (!profileId || profileId === null) return apiResponse.errorMessage(res, 400, productsResMsg.getProducts.nullProfileId);

        const userSql = `SELECT phone FROM users WHERE id = ${userId} LIMIT 1`;
        const [userRows]:any = await pool.query(userSql);
        const userPhone = userRows[0].phone;

        var getPage:any = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page ) {
            page = 1;
        }
        var page_size: any = config.pageSize;       
        const offset = (page - 1 ) * page_size;

        const getPageQuery = `SELECT id, title, overview as description, images, price, status FROM services WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [result]:any= await pool.query(getPageQuery);

        const sql = `SELECT id, title, overview as description, currency_code, images, price, status FROM services WHERE user_id = ${userId} AND profile_id = ${profileId} ORDER BY created_at DESC LIMIT ${page_size} OFFSET ${offset}`;
        const [rows]:any = await pool.query(sql);

        let totalPages:any = result.length/page_size;
        let totalPage = Math.ceil(totalPages);

        const getFeatureStatus = `SELECT status FROM users_features WHERE user_id = ${userId} AND profile_id = ${profileId} AND feature_id = 5`;
        const [featureStatus]:any = await pool.query(getFeatureStatus);

        if (rows.length > 0) {
            // return apiResponse.successResponse(res, "Data Retrieved Successflly", rows);
            return res.status(200).json({
                status: true,
                data: rows,
                userPhone,
                featureStatus: featureStatus[0].status,
                totalPage: totalPage,
                currentPage: page,
                totalLength: result.length,
                message: productsResMsg.getProducts.successMsg
            })
        } else {
            // return apiResponse.successResponse(res, "No Data Found", null);
            return res.status(200).json({
                status: true,
                data: null,
                userPhone,
                featureStatus: featureStatus[0].status,
                totalPage: totalPage,
                currentPage: page,
                totalLength: result.length,
                message: productsResMsg.getProducts.noDataFoundMsg
            })
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const updateProduct =async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.body.type; //type = business, user, null
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, productsResMsg.updateProduct.nullUserId);
        const {profileId, productId, title, description, price, image, currencyCode} = req.body;

        const sql = `UPDATE services SET title = ?, overview = ?, price = ?, currency_code = ?, images = ? WHERE user_id = ? AND id = ?`;
        const VALUES = [title, description, price, currencyCode, image, userId, productId];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, productsResMsg.updateProduct.successMsg, null);
        } else {
            return apiResponse.errorMessage(res, 400, productsResMsg.updateProduct.failedMsg);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const deleteProduct =async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        // const profileId = req.query.profileId;
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, productsResMsg.deleteProduct.nullUserId);

        const productId = req.query.productId;

        const sql = `DELETE FROM services WHERE user_id = ? AND id = ?`;
        const VALUES = [userId, productId];
        const [rows]:any = await pool.query(sql, VALUES);

        return apiResponse.successResponse(res, productsResMsg.deleteProduct.successMsg, null);
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================
