import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';


export const addBusinessHour =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        const createdAt = utility.dateWithFormat();

        const deleteQuery = `DELETE FROM business_hours WHERE user_id = ${userId}`;
        const [data]:any = await pool.query(deleteQuery);

        let sql:any = `INSERT INTO business_hours(user_id, days, start_time, end_time, status, created_at) VALUES `;

        let result:any = "";
        for await (const businessHourData of req.body.businessHours) {
            const days =  businessHourData.days;
            const startTime =  businessHourData.startTime;
            const endTime =  businessHourData.endTime;
            const status =  businessHourData.status;

            sql = sql + ` (${userId}, '${days}', '${startTime}', '${endTime}', '${status}', '${createdAt}'), `;
            result = sql.substring(0,sql.lastIndexOf(','));
        }
        const [rows]:any = await pool.query(result);

        if (rows.affectedRows > 0) {
            return await apiResponse.successResponse(res, "Business Hours Added Successfully", null);
        } else {
            return await apiResponse.errorMessage(res, 400, "Failed to insert, try again");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const businessHourList =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;

        const sql = `SELECT * FROM business_hours WHERE user_id = ${userId}`;
        const [rows]:any = await pool.query(sql);

        if (rows.length > 0) {
            delete rows[0].user_id
            return apiResponse.successResponse(res, "Data Retrieved Successfully", rows);
        } else {
            return apiResponse.successResponse(res, "No data found", null);
        }

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
