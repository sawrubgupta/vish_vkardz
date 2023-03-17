import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';

export const getFeatureByUserId =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;

        const sql = `SELECT users_features.feature_id, features.features, features.slug, users_features.status FROM features LEFT JOIN users_features ON features.id = users_features.feature_id WHERE users_features.user_id = ${userId} AND features.id IN (3, 5, 6, 8, 10, 11)`;
        const [rows]:any = await pool.query(sql);

        const avgFeatureSql = `SELECT users_features.feature_id, features.features, features.slug, users_features.status FROM features LEFT JOIN users_features ON features.id = users_features.feature_id WHERE users_features.user_id = ${userId} AND features.id IN (3, 5, 6, 8, 10, 11) AND users_features.status = 1`;
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

// =======w============================================================================================
// ====================================================================================================
