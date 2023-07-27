import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';


export const exchangeContacts =async (req:Request, res:Response) => {
    try {
        const { username, name, email, phone, message } = req.body;
        const createdAt = utility.dateWithFormat();

        const userSql = `SELECT id FROM users WHERE username = '${username}' LIMIT 1`;
        const [userRows]:any = await pool.query(userSql);
        if (userRows.length === 0) return apiResponse.errorMessage(res, 400, "Invalid username");
        const userId = userRows[0].id;

        const sql = `INSERT INTO exchange_contacts(user_id, name, email, phone, message, created_at) VALUES(?, ?, ?, ?, ?, ?)`;
        const VALUES = [userId, name, email, phone, message, createdAt];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Success", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed!, try again");
        }
        
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res)
    }
}

// ====================================================================================================
// ====================================================================================================

export const captureLead =async (req:Request, res:Response) => {
    try {
        const { username, name, email, phone, message } = req.body;
        const createdAt = utility.dateWithFormat();

        const userSql = `SELECT id FROM users WHERE username = '${username}' LIMIT 1`;
        const [userRows]:any = await pool.query(userSql);
        if (userRows.length === 0) return apiResponse.errorMessage(res, 400, "Invalid username");
        const userId = userRows[0].id;

        const sql = `INSERT INTO leads(user_id, name, email, phone, message, created_at) VALUES(?, ?, ?, ?, ?, ?)`;
        const VALUES = [userId, name, email, phone, message, createdAt];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Success", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed!, try again");
        }
        
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res)
    }
}

// ====================================================================================================
// ====================================================================================================

