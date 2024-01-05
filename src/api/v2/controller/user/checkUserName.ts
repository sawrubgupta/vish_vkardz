import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import pool from '../../../../dbV2';
import * as utility from "../../helper/utility";
import * as apiResponse from '../../helper/apiResponse';
import resMsg from '../../config/responseMsg';

const checkUserNameMsg = resMsg.user.checkUserName;

export const validUserName =async (req:Request, res:Response) => {
    try {
        const username = req.query.username;
        const englishCheck = utility.englishCheck(username);
        if (englishCheck != "") return apiResponse.errorMessage(res, 400, englishCheck);
        if (!username) return apiResponse.errorMessage(res, 400, checkUserNameMsg.validUserName.invalidUsername);
        
        const checkUserNameQuery = `Select username from users where username = '${username}' limit 1`;
        const [rows]:any = await pool.query(checkUserNameQuery);

        if (rows.length > 0) {
            return apiResponse.errorMessage(res, 400, checkUserNameMsg.validUserName.failedMsg);
        } else {
            return apiResponse.successResponse(res, checkUserNameMsg.validUserName.successMsg, null);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const checkEmail =async (req:Request, res:Response) => {
    try {
        const email = req.query.email;
        let emailExist:any;
        if (!email || email === null) return apiResponse.errorMessage(res, 400, checkUserNameMsg.checkEmail.invalidEmail);
        
        const checkEmailQuery = `Select email from users where email = '${email}' AND deleted_at IS NULL limit 1`;
        const [rows]:any = await pool.query(checkEmailQuery);

        if (rows.length > 0) {
            emailExist = 1
            return apiResponse.successResponse(res, checkUserNameMsg.checkEmail.successMsg, emailExist);
        } else {
            emailExist = 0
            return apiResponse.successResponse(res, checkUserNameMsg.checkEmail.emailNotExist, emailExist);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================
