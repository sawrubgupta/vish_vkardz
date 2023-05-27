import { Request, Response } from "express";
import pool from "../../../../db";
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
// import config from "../../config/development";
import md5 from "md5";
import config from '../../config/development';

export const register =async (req:Request, res:Response) => {
    try {
        const { name, email, phone, dialCode, password, jobTitle, company, image } = req.body;
        const createdAt = utility.dateWithFormat();
        const hash = md5(password);

        const checkDupliSql = `SELECT * FROM business_admin WHERE deleted_at IS NULL AND email = ? LIMIT 1`;
        const dupliVALUES = [email];
        const [dupliRows]:any = await pool.query(checkDupliSql, dupliVALUES);

        const dupli = [];
        if (dupliRows.length > 0) {
            if (dupliRows[0].email === email) {
                dupli.push("email");
            }else {
                dupli.push("email");
            }
            console.log(dupli);
            
            const msg = `${dupli.join()} is duplicate, Please change it`;
            return res.status(400).json({
                status: false,
                data: null,
                message: msg,
            });
        }

        const sql = `INSERT INTO business_admin(name, email, phone, dial_code, password, image, job_title, company, created_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const VALUES = [name, email, phone, dialCode, hash, image, jobTitle, company, createdAt];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            const getUserName = `SELECT * FROM business_admin WHERE id = ${rows.insertId} LIMIT 1`;
            const [userRows]:any = await pool.query(getUserName)

            let token = await utility.jwtGenerate(userRows[0].id);
            // delete userRows[0].id;
            return res.status(200).json({
                status: true,
                token,
                data: userRows[0],
                message: "Congratulations, Registered successfully !",
            });    
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to Register, Please try again later");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong")
    }
}

// ====================================================================================================
// ====================================================================================================

export const login =async (req:Request, res:Response) => {
    try {
        const { email, password } = req.body;
        const hash = md5(password);

        const checkUserSql = `SELECT * FROM business_admin WHERE deleted_at IS NULL AND email = '${email}' LIMIT 1`;
        const [userData]:any = await pool.query(checkUserSql);

        if (userData.length > 0) {
            const isLoggedIn =  hash === userData[0].password; // true

            if(isLoggedIn){

                let token = await utility.jwtGenerate(userData[0].id);
                delete userData[0].password;
                delete userData[0].id;
                
                return res.status(200).json({
                    status:true,
                    token,
                    data:userData[0],
                    message:"Successfully logged in !"
                })
            } else {
                return apiResponse.errorMessage(res, 400, "Wrong Password!");
            }
        } else {
            return apiResponse.errorMessage(res, 400, "User Not Registered With Us!");
        }
 
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Somethng went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const forgotPassword =async (req:Request, res:Response) => {
    try {
        const email:string = req.body.email;
        const tempPass:any = utility.randomString(6);
        const hash = md5(tempPass);

        if (!email) return apiResponse.errorMessage(res, 400, "Email required");

        const emailCheckSql = `SELECT email, id FROM business_admin where email = '${email}' LIMIT 1`;
        const [rows]:any = await pool.query(emailCheckSql);

        if (rows.length > 0) {
            const updatePassSql = `UPDATE business_admin SET password = ? where email = ?`;
            const VALUES = [hash, email];
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

export const changeAdminPassword =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;        
        const {oldPassword, newPassword} = req.body;
        const hash = md5(newPassword);

        const sql = `SELECT password from business_admin WHERE id = ${userId}`;
        const [data]:any = await pool.query(sql);

        if (data.length > 0) {
            const oldPassCorrect = md5(oldPassword) ==  data[0].password;
            if (oldPassCorrect) {
                if (oldPassword === newPassword) {
                    return apiResponse.errorMessage(res, 400, "old password and new password can't same");
                }
                const updatePassSql = `Update business_admin Set password = ? where id = ?`;
                const VALUES = [hash, userId]
                const [updatePassword]:any = await pool.query(updatePassSql, VALUES)

                if (updatePassword.affectedRows > 0) {                    
                    return apiResponse.successResponse(res,"Password updated successfully !", null);
                } else {
                    return apiResponse.errorMessage(res,400,"Something Went Wrong, Please Try again later");
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

export const changeUserPassword =async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;    
        let userId:any; 
        const type = req.body.type; //type = business, user, null
        if (type && type === config.businessType) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "User Id is required!");
        }
    
        const {newPassword} = req.body;
        const hash = md5(newPassword);

        const sql = `SELECT password from users WHERE id = ${userId}`;
        const [data]:any = await pool.query(sql);

        if (data.length > 0) {
        //     const oldPassCorrect = md5(oldPassword) ==  data[0].password;
        //     if (oldPassCorrect) {
        //         if (oldPassword === newPassword) {
        //             return apiResponse.errorMessage(res, 400, "old password and new password can't same");
        //         }
                const updatePassSql = `Update users Set password = ? where id = ?`;
                const VALUES = [hash, userId]
                const [updatePassword]:any = await pool.query(updatePassSql, VALUES)

                if (updatePassword.affectedRows > 0) {                    
                    return apiResponse.successResponse(res,"Password updated successfully !", null);
                } else {
                    return apiResponse.errorMessage(res,400,"Something Went Wrong, Please Try again later");
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
