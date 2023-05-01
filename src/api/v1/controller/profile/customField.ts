import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import config from '../../config/development';

export const addCustomField =async (req:Request, res:Response) => {
    try {
        let userId:any; 
        const type = req.body.type; //type = business, user, null
        if (type && type === config.businessType) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !")
        }

        // const { vcfType, vcfValue, status } = req.body;
        // let vcfSql = `INSERT INTO vcf_custom_field(user_id, value, type, status) VALUES `
        let result:any;
        for await (const ele of req.body.vcfData) {
            const vcfId = ele.vcfId;
            const vcfType = ele.vcfType;
            const vcfValue = ele.vcfValue;
            const status = ele.status;

            const checkVcfSql = `SELECT id FROM vcf_custom_field WHERE user_id = ${userId} AND id = '${vcfId}'`;
            const [vcfRows]:any = await pool.query(checkVcfSql);
            
            if (vcfRows.length > 0) {
                const updateVcfSql = `UPDATE vcf_custom_field SET value = '${vcfValue}', type = '${vcfType}', status = ${status} WHERE id = ${vcfId} AND user_id = ${userId}`;
                [result] = await pool.query(updateVcfSql);
            } else {
                let insertVcfSql = `INSERT INTO vcf_custom_field(user_id, value, type, status) VALUES (${userId}, '${vcfValue}', '${vcfType}', ${status})`;
                [result] = await pool.query(insertVcfSql);
            }
            // vcfSql = vcfSql + `(${userId}, '${vcfValue}', '${vcfType}', ${status}),`;
            // result = vcfSql.substring(0,vcfSql.lastIndexOf(','));
        }
        
        if (result.affectedRows > 0) {
            return apiResponse.successResponse(res, "Custom Field added successfully", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to add custom field, Please try again!");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const deleteVcf =async (req:Request, res:Response) => {
    try {
        let userId:any; 
        const type = req.body.type; //type = business, user, null
        if (type && type === config.businessType) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !")
        }
        const vcfId = req.body.vcfId;
        if (!vcfId || vcfId === null || vcfId === '') {
            return apiResponse.errorMessage(res, 400, "Id is required!");
        }
        const sql = `DELETE FROM vcf_custom_field WHERE id = ${vcfId} AND user_id = ${userId}`;
        const [rows]:any = await pool.query(sql);

        return apiResponse.successResponse(res, "Extra Field Deleted Sucessfully", null);
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const getVcf =async (req:Request, res:Response) => {
    try {
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        if (type && type === config.businessType) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !")
        }

        const sql = `SELECT * FROM vcf_custom_field WHERE user_id = ${userId}`;
        const [rows]:any = await pool.query(sql);

        return apiResponse.successResponse(res, "Data Retrieved Successfully", rows);
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}