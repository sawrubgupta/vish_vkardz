import {Request, Response, NextFunction} from "express";
import pool from "../../../../db";
import bcrypt from 'bcryptjs';
import * as utility from "../../helper/utility";
import * as apiResponse from '../../helper/apiResponse';
import md5 from "md5";

export const login =async (req:Request, res:Response) => {
    try {
        const email = req.body.email || req.body.phone || req.body.username ;
        const password = req.body.password;
        const fcmToken = req.body.fcmToken;
        const createdAt = utility.dateWithFormat();
        let vcardLink = `https://vkardz.com/`
        let uName;
        const hash = md5(password);

        const getUser = `SELECT * FROM users where email = '${email}' or phone = '${email}' or username = '${email}' limit 1`;
        const [userRows]:any = await pool.query(getUser);

        if (userRows.length === 0) {
            return apiResponse.errorMessage(res, 400, "User not registered with us, Please signup")
        }

        const isLoggedIn =  hash === userRows[0].password; // true

        if(isLoggedIn){
            if (userRows[0].card_number !== null && userRows[0].card_number !== undefined && userRows[0].card_number !== '') {
                uName = userRows[0].card_number;
            } else if (userRows[0].card_number_fix !== null && userRows[0].card_number_fix !== undefined && userRows[0].card_number_fix !== '') {
                uName = userRows[0].card_number_fix;
            } else {
                uName = userRows[0].username
            }
            
            let vcardProfileLink = (vcardLink)+(uName)
            userRows[0].share_url= vcardProfileLink;
            
            const sql = `UPDATE users set login_time = ?, fcm_token = ? where id = ?`;
            const VALUES = [createdAt, fcmToken, userRows[0].id];
            const [data]:any = await pool.query(sql, VALUES);
            
            if (data.affectedRows > 0) {
                let token = await utility.jwtGenerate(userRows[0].id);
                delete userRows[0].password;
                delete userRows[0].id;
                
                return res.status(200).json({
                    status:true,
                    token,
                    data:userRows[0],
                    message:"Successfully logged in !"
                })    
            } else {
                return apiResponse.errorMessage(res, 400, "Failed to login, try again")
            }
        } else {
            return apiResponse.errorMessage(res, 400, "Unfortunately, Email and Password is incorrect !");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong")
    }
}

// ====================================================================================================
// ====================================================================================================

export const socialLogin =async (req:Request, res:Response) => {
    try {
        const email = req.body.email || req.body.phone || req.body.username;
        const { password, type, socialId, fcmToken } = req.body;
        const createdAt = utility.dateWithFormat();
        let vcardLink = `https://vkardz.com/`
        let uName;
        const hash = md5(password);

        const emailSql = `SELECT * FROM users where status = 1 AND deleted_at IS NULL AND (email = ? or username = ? or phone = ? or facebook_id = ? or google_id = ? or apple_id = ?) LIMIT 1`;
        const emailValues = [email, email, email, socialId, socialId, socialId]
        const [userRow]:any = await pool.query(emailSql, emailValues);

        if (userRow.length === 0) {
            return apiResponse.errorMessage(res, 400, "User not registered with us, Please signup")
        }

        if (type === "email") {
            const userSql = `SELECT * FROM users WHERE deleted_at IS NULL AND (email = '${email}' || username = '${email}') LIMIT 1`;
            const [userRows]:any = await pool.query(userSql)
            if (userRows.length === 0) {
                return apiResponse.errorMessage(res, 400, "User not registered with us, Please signup")
            }
            const isLoggedIn =  hash === userRows[0].password; // true

            if(isLoggedIn){
                if (userRows[0].card_number !== null && userRows[0].card_number !== undefined && userRows[0].card_number !== '') {
                    uName = userRows[0].card_number;
                } else if (userRows[0].card_number_fix !== null && userRows[0].card_number_fix !== undefined && userRows[0].card_number_fix !== '') {
                    uName = userRows[0].card_number_fix;
                } else {
                    uName = userRows[0].username
                }
                
                let vcardProfileLink = (vcardLink)+(uName)
                userRows[0].share_url= vcardProfileLink;
                
                const sql = `UPDATE users set login_time = ?, fcm_token = ? where id = ?`;
                const VALUES = [createdAt, fcmToken, userRows[0].id];
                const [data]:any = await pool.query(sql, VALUES);
                
                if (data.affectedRows > 0) {
                    let token = await utility.jwtGenerate(userRows[0].id);
                    delete userRows[0].password;
                    delete userRows[0].id;
                    
                    return res.status(200).json({
                        status:true,
                        token,
                        data:userRows[0],
                        message:"Successfully logged in !"
                    })    
                } else {
                    return apiResponse.errorMessage(res, 400, "Failed to login, try again")
                }
            } else {
                return apiResponse.errorMessage(res, 400, "Unfortunately, Email and Password is incorrect !");
            }
        } else if (type === "facebook") {

        //    const sql = `SELECT * FROM users WHERE deleted_at IS NULL AND (email = '${email}' || facebook_id = '${socialId}' ) LIMIT 1`;
           const sql = `SELECT * FROM users WHERE deleted_at IS NULL AND (email = '${email}') LIMIT 1`;
           const [fbRows]:any = await pool.query(sql);
           
           if (fbRows.length > 0) {
            const sql = `UPDATE users set login_time = ?, fcm_token = ?, facebook_id = '${socialId}' where id = ?`;
            const VALUES = [createdAt, fcmToken, fbRows[0].id];
            const [data]:any = await pool.query(sql, VALUES);
            
            if (data.affectedRows > 0) {
                let token = await utility.jwtGenerate(fbRows[0].id);
                delete fbRows[0].password;
                delete fbRows[0].id;
                
                return res.status(200).json({
                    status:true,
                    token,
                    data:fbRows[0],
                    message:"Successfully logged in !"
                })    
            } else {
                return apiResponse.errorMessage(res, 400, "Failed to login, try again")
            }
           } else {
               return apiResponse.errorMessage(res, 400, "User not exist !")
           }
        } else if (type === "google") {
            const sql = `SELECT * FROM users WHERE deleted_at IS NULL AND  (email = '${email}') LIMIT 1`;
           const [fbRows]:any = await pool.query(sql);
           
           if (fbRows.length > 0) {
            const sql = `UPDATE users set login_time = ?, fcm_token = ?, google_id = '${socialId}' where id = ?`;
            const VALUES = [createdAt, fcmToken, fbRows[0].id];
            const [data]:any = await pool.query(sql, VALUES);
            
            if (data.affectedRows > 0) {
                let token = await utility.jwtGenerate(fbRows[0].id);
                delete fbRows[0].password;
                delete fbRows[0].id;
                
                return res.status(200).json({
                    status:true,
                    token,
                    data:fbRows[0],
                    message:"Successfully logged in !"
                })    
            } else {
                return apiResponse.errorMessage(res, 400, "Failed to login, try again")
            }
           } else {
               return apiResponse.errorMessage(res, 400, "User not exist !")
           }
        } else if (type === "apple") {
            const sql = `SELECT * FROM users WHERE deleted_at IS NULL AND  (email = '${email}') LIMIT 1`;
           const [fbRows]:any = await pool.query(sql);
           
           if (fbRows.length > 0) {
            const sql = `UPDATE users set login_time = ?, fcm_token = ?, apple_id = '${socialId}' where id = ?`;
            const VALUES = [createdAt, fcmToken, fbRows[0].id];
            const [data]:any = await pool.query(sql, VALUES);
            
            if (data.affectedRows > 0) {
                let token = await utility.jwtGenerate(fbRows[0].id);
                delete fbRows[0].password;
                delete fbRows[0].id;
                
                return res.status(200).json({
                    status:true,
                    token,
                    data:fbRows[0],
                    message:"Successfully logged in !"
                })    
            } else {
                return apiResponse.errorMessage(res, 400, "Failed to login, try again")
            }
           } else {
               return apiResponse.errorMessage(res, 400, "User not exist !")
           }
        } else {
            return apiResponse.errorMessage(res, 400, "Wrong type passed !");
        }
    } catch (error) {
        console.log("Something went wrong",error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

/*
// use bcrypt
export const login =async (req:Request, res:Response) => {
    try {
        const email = req.body.email || req.body.phone || req.body.username ;
        const password = req.body.password;
        const createdAt = utility.dateWithFormat();
        let vcardLink = `https://vkardz.com/`
        let uName;
        const hash = md5(password);

        const getUser = `SELECT * FROM users where email = '${email}' or phone = '${email}' or username = '${email}' limit 1`;
        const [userRows]:any = await pool.query(getUser);

        if (userRows.length === 0) {
            return apiResponse.errorMessage(res, 400, "User not registered with us, Please signup")
        }

        if (userRows[0].card_number !== null && userRows[0].card_number !== undefined && userRows[0].card_number !== '') {
            uName = userRows[0].card_number;
        } else if (userRows[0].card_number_fix !== null && userRows[0].card_number_fix !== undefined && userRows[0].card_number_fix !== '') {
            uName = userRows[0].card_number_fix;
        } else {
            uName = userRows[0].username
        }

        const hashedPassword = userRows[0].password;
        let vcardProfileLink = (vcardLink)+(uName)
        userRows[0].share_url= vcardProfileLink;
        
        bcrypt.compare(password, hashedPassword, async(err, isMatch) => {
            if (err) {
                return apiResponse.errorMessage(res, 400, "Failed to login, Please try again or Contact support team")
            }
            if (isMatch) {
                const sql = `UPDATE users set login_time = ? where id = ?`;
                const VALUES = [createdAt, userRows[0].id];
                
                const [data]:any = await pool.query(sql, VALUES);
                if (data.affectedRows > 0) {
                    let token = await utility.jwtGenerate(userRows[0].id);
                    delete userRows[0].password;
                    delete userRows[0].id;
    
                    return res.status(200).json({
                        status:true,
                        token,
                        data:userRows[0],
                        message:"Successfully logged in !"
                    })    
                } else {
                    return apiResponse.errorMessage(res, 400, "Failed to login, try again")
                }
            }
            if (!isMatch) {
                return apiResponse.errorMessage(res, 400, "Unfortunately, Email and Password is incorrect!!");
            }
        })

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong")
    }
}
*/