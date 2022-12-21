import {Request, Response, NextFunction} from "express";
import pool from "../../../../db";
import bcrypt from 'bcryptjs';
import * as utility from "../../helper/utility";
import * as apiResponse from '../../helper/apiResponse';

export const login =async (req:Request, res:Response) => {
    try {
        const email = req.body.email || req.body.phone || req.body.username ;
        const password = req.body.password;
        const createdAt = utility.dateWithFormat();
        let vcardLink = `https://vkardz.com/`
        let uName;

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
                console.log(VALUES);
                
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

// ====================================================================================================
// ====================================================================================================
