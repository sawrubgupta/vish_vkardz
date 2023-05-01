import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config from '../../config/development';

export const addUpdateAboutUs =async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        if (type && type === config.businessType) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "User Id is required!");
        }

        const createdAt = utility.dateWithFormat();
        const { companyName, year, business, aboutUsDetail, image } = req.body;

        const getAboutUs = `SELECT id FROM about WHERE user_id = ${userId}`;
        const [aboutUsRows]:any = await pool.query(getAboutUs);

        if (aboutUsRows.length > 0) {
            const updateQuery = `UPDATE about SET company_name = ?, year = ?, business = ?, about_detail = ?, images = ? WHERE user_id = ?`;
            const VALUES = [companyName, year, business, aboutUsDetail, image, userId];
            const [updatedRows]:any = await pool.query(updateQuery, VALUES);

            if (updatedRows.affectedRows > 0) {
                return apiResponse.successResponse(res, "Updated Successfully", null);
            } else {
                return apiResponse.errorMessage(res, 400, "Failed to update, try again");
            }
        } else {
            const insertedQuery = `INSERT INTO about(user_id, company_name, business, year, about_detail, images, created_at) VALUES (?, ?, ?, ?, ?, ? ,?)`;
            const insertVALUES = [userId, companyName, business, year, aboutUsDetail, image, createdAt];
            const [insertedRows]:any = await pool.query(insertedQuery, insertVALUES);

            if (insertedRows.affectedRows > 0) {
                return apiResponse.successResponse(res, "Inserted Successfully", null);
            } else {
                return apiResponse.errorMessage(res, 400, "Failed to insert, try again");
            }
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const getAboutUs =async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        if (type && type === config.businessType) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "User Id is required!");
        }

        const sql = `SELECT id, company_name, business, year, about_detail, images, created_at FROM about WHERE user_id = ${userId}`;
        const [rows]:any = await pool.query(sql);

        const getFeatureStatus = `SELECT status FROM users_features WHERE user_id = ${userId} AND feature_id = 3`;
        const [featureStatusRRows]:any = await pool.query(getFeatureStatus);
        let featureStatus = featureStatusRRows[0].status;

        if (rows.length > 0) {    
            rows[0].featureStatus = featureStatus;
            return apiResponse.successResponse(res, "Data Retrieved Successfully", rows[0]);
        } else {
            // return apiResponse.successResponse(res, "No Data Found", null)
            return res.status(200).json({
                status: true,
                data: null, featureStatus,
                message: "No Data Found"
            })
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const deleteAboutUs =async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        if (type && type === config.businessType) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "User Id is required!");
        }


        const sql = `DELETE FROM about WHERE user_id = ${userId}`;
        const [rows]:any = await pool.query(sql);

        return apiResponse.successResponse(res, "Deleted Successfully", null);
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
