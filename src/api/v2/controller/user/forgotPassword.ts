import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import * as apiResponse from "../../helper/apiResponse";
import pool from "../../../../dbV2";
import * as utility from "../../helper/utility";
import md5 from "md5";
import resMsg from '../../config/responseMsg';
import fs from 'fs';
import path from 'path';
import Handlebars from "handlebars";

const forgotPasswordMsg = resMsg.user.forgotPassword;

export const forgotPassword =async (req:Request, res:Response) => {
    try {
        const email:string = req.body.email;
        const tempPass:any = utility.randomString(6);
        const hash = md5(tempPass);

        if (!email) return apiResponse.errorMessage(res, 400, forgotPasswordMsg.forgotPassword.invalidEmail);

        const emailCheckSql = `SELECT username, email, id FROM users where email = '${email}' AND deleted_at IS NULL limit 1`;
        const [rows]:any = await pool.query(emailCheckSql);

        if (rows.length > 0) {
            const updatePassSql = `Update users Set password = ? where id = ?`;
            const VALUES = [hash, rows[0].id];
            const [updatePassword]:any = await pool.query(updatePassSql, VALUES);
            if (updatePassword.affectedRows > 0) {            
                
                const a = path.join('./views', 'forgotPassword.hbs');
                console.log("a", a);
                
                var source: string = fs.readFileSync(path.join('./views', 'forgotPassword.hbs'), 'utf8');
                var template = Handlebars.compile(source);
                var htmlData = { name: rows[0].username, newPassword: tempPass };
                var sendData = template(htmlData);
    

                const result:any = await utility.sendHtmlMail(email, "Password Reset Request", sendData);
                if (result === false) return apiResponse.errorMessage(res, 400, "Failed to send mail, contact support");
                
                return apiResponse.successResponse(res, forgotPasswordMsg.forgotPassword.successMsg,null );
            } else {
                return apiResponse.errorMessage(res,400, forgotPasswordMsg.forgotPassword.failedMsg);
            }
        } else {
            return apiResponse.errorMessage( res, 400, forgotPasswordMsg.forgotPassword.invalidEmail);
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

