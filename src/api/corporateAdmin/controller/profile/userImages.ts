import { Request, Response } from "express";
import pool from "../../../../db";
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config from "../../config/development";
import md5 from "md5";

//not used
export const uploadImage =async (req:Request, res:Response) => {
    try {
        // let userId:any; 
        // const type = req.query.type; //type = business, user, null
        // if (type && type === config.businessType) {
        //     userId = req.query.userId;
        // } else {
        //     userId = res.locals.jwt.userId;
        // }
        const userId = req.body.userId;
        const { type, image } = req.body.type;
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "User Id is required!");
        }
        const createdAt =utility.dateWithFormat();

        const sql = `INSERT INTO user_images(user_id, type, image, created_at) VALUES(?, ?, ?, ?)`;
        const VALUES = [userId, type, image, createdAt];
        const [rows]:any = await pool.query(sql, VALUES);
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

