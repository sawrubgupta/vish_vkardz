import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';

export const getFeatureByUserId =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;

        const sql = `SELECT users_features.feature_id, features.features, features.slug, users_features.status FROM features LEFT JOIN users_features ON features.id = users_features.feature_id WHERE users_features.user_id = ${userId} AND features.id IN (3, 5, 6, 8, 10, 11, 13, 14, 15)`;
        const [rows]:any = await pool.query(sql);

        if (rows.length > 0) {
            return apiResponse.successResponse(res, "User Features Get Successfully", rows);
        } else {
            return apiResponse.successResponse(res, "No data found", null);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Somehing went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const updateUserFeaturesStatus =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        let data:any;
        const sql = `UPDATE users_features SET status = ? WHERE user_id = ? AND feature_id = ?`;

        for await (const element of req.body.features) {
            const featureId =  element.featureId;
            const status =  element.status;
    
            let VALUES = [status, userId, featureId];            
            [data] = await pool.query(sql, VALUES);
        }
        
        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Fatures updated successfully", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to update user featyre, try again");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
