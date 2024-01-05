import pool from '../../../../dbV2';
import { Request, Response } from "express";
import * as apiResponse from '../../helper/apiResponse';
import resMsg from '../../config/responseMsg';

const countryListMsg = resMsg.user.countryList;

export const countryList =async (req:Request, res:Response) => {
    try {
        const sql = `SELECT * FROM countries ORDER BY name ASC`;
        const [rows]:any = await pool.query(sql);

        if (rows.length > 0) {
            return apiResponse.successResponse(res, countryListMsg.countryList.dataRetrivedMsg, rows)
        } else {
            return apiResponse.errorMessage(res, 400, countryListMsg.countryList.noDataFoundMsg);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}
// ====================================================================================================
// ====================================================================================================
