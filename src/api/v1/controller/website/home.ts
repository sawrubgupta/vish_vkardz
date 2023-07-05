import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';


export const contactUs =async (req:Request, res:Response) => {
    try {
        const { name, email, subject, message } = req.body;
        const currentDate = utility.dateWithFormat();

        const sql = `INSERT INTO contact_us(name, email, subject, message, created_at) VALUES(?, ?, ?, ?, ?)`;
        const VALUES = [name, email, subject, message, currentDate];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Success", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed!, try again");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
