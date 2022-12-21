import {Request, Response} from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';

export const setting =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        const {pushNotificationEnable, emailNotificationEnable, currencyCode, languageSelection} = req.body;

        const sql = `UPDATE users SET currency_code = ?, push_notification_enable = ?,email_notification_enable = ?, language_selection = ? where id = ?`;
        const VALUES = [currencyCode, pushNotificationEnable, emailNotificationEnable, languageSelection, userId];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res,"Setting updated successfully !", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to update setting")
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong")
    }
}