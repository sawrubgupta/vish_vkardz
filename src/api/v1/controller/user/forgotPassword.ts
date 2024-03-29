import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import * as apiResponse from "../../helper/apiResponse";
import pool from "../../../../db";
import * as utility from "../../helper/utility";
import md5 from "md5";

export const forgotPassword =async (req:Request, res:Response) => {
    try {
        const email:string = req.body.email;
        const tempPass:any = utility.randomString(6);
        const hash = md5(tempPass);

        if (!email) return apiResponse.errorMessage(res, 400, "Email required");

        const emailCheckSql = `SELECT email, id FROM users where email = '${email}' limit 1`;
        const [rows]:any = await pool.query(emailCheckSql);

        if (rows.length > 0) {
            const updatePassSql = `Update users Set password = ? where id = ?`;
            const VALUES = [hash, rows[0].id];
            const [updatePassword]:any = await pool.query(updatePassSql, VALUES);
            if (updatePassword.affectedRows > 0) {                    
                const result:any = await utility.sendMail(email, "Password Reset", "You have requested a new password here it is: " + tempPass);
                if (result === false) return apiResponse.errorMessage(res, 400, "Failed to send mail");
                
                return apiResponse.successResponse(res,"Check your mail inbox for new Password",null );
            } else {
                return apiResponse.errorMessage(res,400,"Something Went Wrong, Please Try again later");
            }
        } else {
            return apiResponse.errorMessage( res, 400, "Email not registered with us ! ");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong")
    }
}

// ====================================================================================================
// ====================================================================================================

/*
//use bcrypt
export const forgotPassword =async (req:Request, res:Response) => {
    try {
        const email:string = req.body.email;
        const tempPass:any = utility.randomString(6);
        
        if (!email) return apiResponse.errorMessage(res, 400, "Email required");

        const emailCheckSql = `SELECT email, id FROM users where email = '${email}' limit 1`;
        const [rows]:any = await pool.query(emailCheckSql);

        if (rows.length > 0) {
            bcrypt.hash(tempPass, 10, async (err, hash) => {
                if (err) {
                    return apiResponse.errorMessage(res, 400, "Something Went Wrong, Contact Support!!");
                }
                const updatePassSql = `Update users Set password = ? where id = ?`;
                const VALUES = [hash, rows[0].id]
                const [updatePassword]:any = await pool.query(updatePassSql, VALUES)
                
                if (updatePassword.affectedRows > 0) {                    
                    await utility.sendMail(email, "Password Reset", "You have requested a new password here it is: " + tempPass);
                    return apiResponse.successResponse(res,"Check your mail inbox for new Password",null );
                } else {
                    return apiResponse.errorMessage(res,400,"Something Went Wrong, Please Try again later");
                }
            })
        } else {
            return apiResponse.errorMessage( res, 400, "Email not registered with us ! ");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong")
    }
}
*/
// ====================================================================================================
// ====================================================================================================

