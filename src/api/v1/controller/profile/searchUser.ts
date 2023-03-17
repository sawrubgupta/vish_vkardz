import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';


export const search =async (req:Request, res: Response) => {
    try {
        const keyword = req.query.keyword;

        const sql = `SELECT id, username, name, thumb, phone, email FROM users WHERE name LIKE '%${keyword}%' OR address LIKE '%${keyword}%' OR designation LIKE '%${keyword}%'`;
        const [rows]:any = await pool.query(sql);

        if (rows.length > 0) {
            return apiResponse.successResponse(res, "Success", rows);
        } else {
            return apiResponse.successResponse(res, "No Data Found", []);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 40, "Somethiong went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
