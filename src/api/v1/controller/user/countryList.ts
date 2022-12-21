import pool from '../../../../db';
import { Request, Response } from "express";
import * as apiResponse from '../../helper/apiResponse';

export const countryList =async (req:Request, res:Response) => {
    try {
        const sql = `SELECT * FROM countries ORDER BY name ASC`;
        const [rows]:any = await pool.query(sql);

        if (rows.length > 0) {
            return apiResponse.successResponse(res, "Plans list is here !", rows)
        } else {
            return apiResponse.errorMessage(res, 400, "No Country List found");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}
// ====================================================================================================
// ====================================================================================================
