import {Request, Response, NextFunction} from 'express';
import * as apiResponse from '../../helper/apiResponse';
import pool from '../../../../db';
import bcrypt from 'bcryptjs';
import md5 from "md5";

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
                if (oldPassword === newPassword) {
                    return apiResponse.errorMessage(res, 400, "old password and new password can't same");
                }
                const updatePassSql = `Update users Set password = ? where id = ?`;
                const VALUES = [hash, userId]
                const [updatePassword]:any = await pool.query(updatePassSql, VALUES)

                if (updatePassword.affectedRows > 0) {                    
                    return await apiResponse.successResponse(res,"Password updated successfully !", null);
                } else {
                    return await apiResponse.errorMessage(res,400,"Something Went Wrong, Please Try again later");
                }   
            } else {
                return apiResponse.errorMessage(res, 400, "Wrong old password !!");
            }
        } else{
            return apiResponse.errorMessage(res, 400, "User not found !")
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
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
