import { Request, Response } from "express";
import pool from '../../../../dbV2';
import * as apiResponse from '../../helper/apiResponse';
import config from '../../config/development';
import * as utility from "../../helper/utility";
import resMsg from '../../config/responseMsg';

const orderResMsg = resMsg.profile.customField;

export const addCustomField =async (req:Request, res:Response) => {
    try {
        let userId:any; 
        const type = req.body.type; //type = business, user, null
        const profileId = req.body.profileId;
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, orderResMsg.addCustomField.nullUserId)

        // const { vcfType, vcfValue, status } = req.body;
        // let vcfSql = `INSERT INTO vcf_custom_field(user_id, value, type, status) VALUES `
        let result:any;
        for await (const ele of req.body.vcfData) {
            const vcfId = ele.vcfId;
            const icon = ele.icon;
            const vcfType = ele.vcfType;
            const name = ele.name;
            const vcfValue = ele.vcfValue;
            const status = ele.status;

            const checkVcfSql = `SELECT id FROM vcf_custom_field WHERE user_id = ${userId} AND id = '${vcfId}'`;
            const [vcfRows]:any = await pool.query(checkVcfSql);
            
            if (vcfRows.length > 0) {
                const updateVcfSql = `UPDATE vcf_custom_field SET value = '${vcfValue}', type = '${vcfType}', icon = '${icon}', name = '${name}', status = ${status} WHERE id = ${vcfId} AND user_id = ${userId}`;
                [result] = await pool.query(updateVcfSql);
            } else {
                let insertVcfSql = `INSERT INTO vcf_custom_field(user_id, profile_id, value, icon, name, type, status) VALUES (${userId}, ${profileId}, '${vcfValue}', '${icon}', '${name}', '${vcfType}', ${status})`;
                [result] = await pool.query(insertVcfSql);
            }
            // vcfSql = vcfSql + `(${userId}, '${vcfValue}', '${vcfType}', ${status}),`;
            // result = vcfSql.substring(0,vcfSql.lastIndexOf(','));
        }
        
        if (result.affectedRows > 0) {
            return apiResponse.successResponse(res, orderResMsg.addCustomField.successMsg, null);
        } else {
            return apiResponse.errorMessage(res, 400, orderResMsg.addCustomField.failedMsg);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const deleteVcf =async (req:Request, res:Response) => {
    try {
        let userId:any; 
        const type = req.body.type; //type = business, user, null
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        const vcfId = req.body.vcfId;

        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, orderResMsg.deleteVcf.nullUserId);
        if (!vcfId || vcfId === null || vcfId === '')  return apiResponse.errorMessage(res, 400, orderResMsg.deleteVcf.invalidVcfId);
        
        const sql = `DELETE FROM vcf_custom_field WHERE id = ${vcfId} AND user_id = ${userId}`;
        const [rows]:any = await pool.query(sql);

        return apiResponse.successResponse(res, orderResMsg.deleteVcf.successMsg, null);
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const getVcf =async (req:Request, res:Response) => {
    try {
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        const profileId = req.query.profileId;
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, orderResMsg.getVcf.nullUserId);

        const sql = `SELECT * FROM vcf_custom_field WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [rows]:any = await pool.query(sql);

        return apiResponse.successResponse(res, orderResMsg.getVcf.successMsg, rows);
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const addUserCustomInfo = async (req:Request, res:Response) => {
    try {
        let userId:any; 
        const { profileId, vcfType, vcfValue } = req.body;
        const type = req.body.type; //type = business, user, null
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, orderResMsg.addUserCustomInfo.nullUserId);

        const createdAt = utility.dateWithFormat();

        const vcfInfoSql = `INSERT INTO vcf_info(user_id, profile_id, type, value, status, created_at) VALUES(?, ?, ?, ?, ?, ?)`;
        const vcfVALUES = [userId, profileId, vcfType, vcfValue, 1, createdAt];
        const [vcfInfoRows]:any = await pool.query(vcfInfoSql, vcfVALUES);

        if (vcfInfoRows.affectedRows > 0) {
            return apiResponse.successResponse(res, orderResMsg.addUserCustomInfo.successMsg, null);
        } else {
            return apiResponse.errorMessage(res, 400, orderResMsg.addUserCustomInfo.failedMsg);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const deleteUsercf =async (req:Request, res:Response) => {
    try {
        let userId:any; 
        const type = req.body.type; //type = business, user, null
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, orderResMsg.deleteUsercf.invalidId);
        
        const fieldId = req.body.fieldId;
        if (!fieldId || fieldId === null || fieldId === '') return apiResponse.errorMessage(res, 400, orderResMsg.deleteUsercf.invalidId);
        
        const sql = `DELETE FROM vcf_info WHERE id = ${fieldId} AND user_id = ${userId}`;
        const [rows]:any = await pool.query(sql);

        return apiResponse.successResponse(res, orderResMsg.deleteUsercf.successMsg, null);
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const getUserCustomField =async (req:Request, res:Response) => {
    try {
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        const profileId = req.query.profileId;
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, orderResMsg.getUserCustomField.nullUserId);

        const sql = `SELECT * FROM vcf_info WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [rows]:any = await pool.query(sql);

        return apiResponse.successResponse(res, orderResMsg.getUserCustomField.successMsg, rows);
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

//not completed and not used
export const updateUserCustomInfo = async (req:Request, res:Response) => {
    try {
        let userId:any; 
        const { profileId, vcfType, vcfValue } = req.body;
        const type = req.body.type; //type = business, user, null
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !")
        }
        const createdAt = utility.dateWithFormat();

        const vcfInfoSql = `INSERT INTO vcf_info(user_id, profile_id, type, value, status, created_at) VALUES(?, ?, ?, ?, ?, ?)`;
        const vcfVALUES = [userId, profileId, vcfType, vcfValue, 1, createdAt];
        const [vcfInfoRows]:any = await pool.query(vcfInfoSql, vcfVALUES);

        if (vcfInfoRows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Success", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed!, try again");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================
