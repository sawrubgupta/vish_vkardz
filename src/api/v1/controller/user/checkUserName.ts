import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import pool from '../../../../db';
import * as utility from "../../helper/utility";
import * as apiResponse from '../../helper/apiResponse';

export const validUserName =async (req:Request, res:Response) => {
    try {
        const username = req.query.username;
        const englishCheck = utility.englishCheck(username);
        if (englishCheck != "") {
            return apiResponse.errorMessage(res, 400, "englishCheck");
        }
        if (!username) {
            return apiResponse.errorMessage(res, 400, "Enter Valid UserName.");
        }
        const checkUserNameQuery = `Select username from users where username = '${username}' limit 1`;
        const [rows]:any = await pool.query(checkUserNameQuery);

        if (rows.length > 0) {
            return apiResponse.errorMessage(res, 400, "Username is not available !");
        } else {
            return apiResponse.successResponse(res, "Username is available!", null);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
