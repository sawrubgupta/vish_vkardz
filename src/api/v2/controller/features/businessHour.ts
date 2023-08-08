import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config from '../../config/development';


export const addBusinessHour = async (req: Request, res: Response) => {
    try {
        // const userId: string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        const profileId = req.body.profileId;
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, "User Id is required!");
        
        const createdAt = utility.dateWithFormat();

        const deleteQuery = `DELETE FROM business_hours WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [data]: any = await pool.query(deleteQuery);

        let sql: any = `INSERT INTO business_hours(user_id, days, start_time, end_time, status, created_at) VALUES `;

        let result: any = "";
        for await (const businessHourData of req.body.businessHours) {
            const days = businessHourData.days;
            const startTime = businessHourData.startTime;
            const endTime = businessHourData.endTime;
            const status = businessHourData.status;

            sql = sql + ` (${userId}, '${days}', '${startTime}', '${endTime}', '${status}', '${createdAt}'), `;
            result = sql.substring(0, sql.lastIndexOf(','));
        }
        const [rows]: any = await pool.query(result);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Business Hours Added Successfully", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to insert, try again");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const businessHourList = async (req: Request, res: Response) => {
    try {
        // const userId = res.locals.jwt.userId;
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        const profileId = req.query.profileId;
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "User Id is required!");
        }
        if (!profileId || profileId == null) return apiResponse.errorMessage(res, 400, "Profile id is required");

        const sql = `SELECT * FROM business_hours WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [rows]: any = await pool.query(sql);

        const getFeatureStatus = `SELECT status FROM users_features WHERE user_id = ${userId} AND profile_id = ${profileId} AND feature_id = 6`;
        const [featureStatusRRows]:any = await pool.query(getFeatureStatus);
        let featureStatus = featureStatusRRows[0].status;

        if (rows.length > 0) {
            rows[0].featureStatus = featureStatus;
            delete rows[0].user_id
            return apiResponse.successResponse(res, "Data Retrieved Successfully", rows);
        } else {
            let data = [{
                "id": null,
                "days": 0,
                "start_time": "00.00",
                "end_time": "00.00",
                "status": 0,
                "created_at": null
            },
                {
                    "id": null,
                    "days": 1,
                    "start_time": "00.00",
                    "end_time": "00.00",
                    "status": 0,
                    "created_at": null
                },
                {
                    "id": null,
                    "days": 2,
                    "start_time": "00.00",
                    "end_time": "00.00",
                    "status": 0,
                    "created_at": null
                },
                {
                    "id": null,
                    "days": 3,
                    "start_time": "00.00",
                    "end_time": "00.00",
                    "status": 0,
                    "created_at": null
                },
                {
                    "id": null,
                    "days": 4,
                    "start_time": "00.00",
                    "end_time": "00.00",
                    "status": 0,
                    "created_at": null
                },
                {
                    "id": null,
                    "days": 5,
                    "start_time": "00.00",
                    "end_time": "00.00",
                    "status": 0,
                    "created_at": null
                },
                {
                    "id": null,
                    "days": 6,
                    "start_time": "00.00",
                    "end_time": "00.00",
                    "status": 0,
                    "created_at": null
                }]
            // return apiResponse.successResponse(res, "No data found", data);
            return res.status(200).json({
                status: true,
                data: data, featureStatus,
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
