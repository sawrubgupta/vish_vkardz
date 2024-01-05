import { Request, Response } from "express";
import pool from '../../../../dbV2';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';
import resMsg from '../../config/responseMsg';

const orderResMsg = resMsg.orders.transaction;

export const transactionHistory =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;

        const sql = `SELECT id, txn_id, price, country, payment_type, status, created_at FROM all_payment_info WHERE user_id = ${userId} ORDER BY created_at DESC`;
        const [rows]:any = await pool.query(sql);

        if (rows.length > 0) {
            rows.forEach((element:any, index:any) => {
                if (rows[index].payment_type === 1) {
                    rows[index].paymntMethod = 'offline';
                } else {
                    rows[index].paymntMethod = 'online';
                }
            });
            return apiResponse.successResponse(res, orderResMsg.transactionHistory.successMsg, rows);
        } else {
            return apiResponse.successResponse(res, orderResMsg.transactionHistory.noDataFoundMsg, null);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================
