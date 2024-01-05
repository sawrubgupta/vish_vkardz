import {Request, Response, NextFunction} from 'express';
import * as apiResponse from '../../helper/apiResponse';
import pool from '../../../../dbV2';
import bcrypt from 'bcryptjs';
import md5 from "md5";
import resMsg from '../../config/responseMsg';

const changePasswordMsg = resMsg.user.changePassword;

export const changePassword =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;        
        const {oldPassword, newPassword} = req.body;
        const hash = md5(newPassword);

        const sql = `SELECT password from users WHERE id = ${userId}`;
        const [data]:any = await pool.query(sql);

        if (data.length > 0) {
            const oldPassCorrect = md5(oldPassword) ==  data[0].password;
            if (oldPassCorrect) {
                if (oldPassword === newPassword) return apiResponse.errorMessage(res, 400, changePasswordMsg.changePassword.passwordNotMatch);
                
                const updatePassSql = `Update users Set password = ? where id = ?`;
                const VALUES = [hash, userId]
                const [updatePassword]:any = await pool.query(updatePassSql, VALUES)

                if (updatePassword.affectedRows > 0) {                    
                    return apiResponse.successResponse(res,changePasswordMsg.changePassword.successMsg, null);
                } else {
                    return apiResponse.errorMessage(res,400,changePasswordMsg.changePassword.failedMsg);
                }   
            } else {
                return apiResponse.errorMessage(res, 400, changePasswordMsg.changePassword.wrongPasword);
            }
        } else{
            return apiResponse.errorMessage(res, 400, changePasswordMsg.changePassword.userNotFound);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

/*
//use bcrypt
export const changePassword =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;        
        const {oldPassword, newPassword} = req.body;

        const sql = `SELECT password from users WHERE id = ${userId}`;
        const [data]:any = await pool.query(sql);

        const hashedPassword = data[0].password;
        if (data.length > 0) {
            bcrypt.compare(oldPassword, hashedPassword, async(err, isMatch) => {
                if (err) {
                    return apiResponse.errorMessage(res, 400, "Failed to login, Please try again or Contact support team")
                }
                if (isMatch) {
                    bcrypt.hash(newPassword, 10, async (err, hash) => {
                        if (err) {
                            return apiResponse.errorMessage(res, 400, "Something Went Wrong, Contact Support!!");
                        }
                        const updatePassSql = `Update users Set password = ? where id = ?`;
                        const VALUES = [hash, userId]
                        const [updatePassword]:any = await pool.query(updatePassSql, VALUES)
                        
                        if (updatePassword.affectedRows > 0) {                    
                            return await apiResponse.successResponse(res,"Password updated successfully !", null);
                        } else {
                            return await apiResponse.errorMessage(res,400,"Something Went Wrong, Please Try again later");
                        }
                    })
                }
                if (!isMatch) {
                    return apiResponse.errorMessage(res, 400, "Wrong old password !!");
                }    
            })
        } else{
            return apiResponse.errorMessage(res, 400, "User not found !")
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}
*/
// ====================================================================================================
// ====================================================================================================
