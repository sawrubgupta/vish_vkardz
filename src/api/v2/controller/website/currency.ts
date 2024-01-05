import { Request, Response } from "express";
import pool from '../../../../dbV2';
import * as apiResponse from '../../helper/apiResponse';


export const currencyList =async (req:Request, res:Response) => {
    try {
        const sql = `SELECT * FROM currencies`;
        const [rows]:any = await pool.query(sql);

        return apiResponse.successResponse(res, "Data Retrieved Successfully", rows);
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================
