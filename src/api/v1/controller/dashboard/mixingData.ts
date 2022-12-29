import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from "../../helper/apiResponse";

export const mixingData =async (req:Request, res:Response) => {
    try {
        const geturls = `SELECT slug, url FROM app_setting WHERE status = 1`;
        const [url]:any = await pool.query(geturls);

        const appVersionQuery = `SELECT * FROM app_update`;
        const [appVersionData]:any = await pool.query(appVersionQuery);

        // return apiResponse.successResponse(res, "Data Retrieved Successfully", data);\
        return res.status(200).json({
            status: true,
            url, appVersionData,
            message: "Data Retrieved Successfully"
        })

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}