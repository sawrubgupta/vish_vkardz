import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';


export const enquiryList =async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        if (type && (type === config.businessType  || type === config.websiteType)) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "User Id is required!");
        }
 
        var getPage:any = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page ) {
            page = 1;
        }
        var page_size: any = config.pageSize;       
        const offset = (page - 1 ) * page_size;

        const getPageQuery = `SELECT id, name, email, phone_num, msg, created_at FROM user_contacts WHERE user_id = ${userId}`;
        const [result]:any= await pool.query(getPageQuery);

        const sql = `SELECT id, name, email, phone_num, msg, created_at FROM user_contacts WHERE user_id = ${userId} ORDER BY id DESC LIMIT ${page_size} OFFSET ${offset}`;
        const [rows]:any = await pool.query(sql);

        const getFeatureStatus = `SELECT status FROM users_features WHERE user_id = ${userId} AND feature_id = 11`;
        let [featureStatus]:any = await pool.query(getFeatureStatus);

        if(featureStatus.length === 0) {
            featureStatus[0] = {};
            featureStatus[0].status = 0;
        }

        let totalPages:any = result.length/page_size;
        let totalPage = Math.ceil(totalPages);

        if (rows.length > 0) {
            return res.status(200).json({
                status: true,
                data: rows,
                featureStatus: featureStatus[0].status || "",
                totalPage: totalPage,
                currentPage: page,
                totalLength: result.length,
                message: "Data Retrieved Successflly"
            })
        } else {
            return res.status(200).json({
                status: true,
                data: null,
                featureStatus: featureStatus[0].status,
                totalPage: totalPage,
                currentPage: page,
                totalLength: result.length,
                message: "No Data Found"
            })
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const deleteEnquiry =async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        if (type && type == config.businessType) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "User Id is required!");
        }

        const enquiryId = req.body.enquiryId;

        const sql = `DELETE FROM user_contacts WHERE user_id = ? AND id = ?`;
        const VALUES = [userId, enquiryId]
        const [rows]:any = await pool.query(sql, VALUES)

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Enquiry Deleted Successfuly", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to delete, try again");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something ent wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const replyEnquiry =async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        if (type && type === config.businessType) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "User Id is required!");
        }

        const enquiryId = req.body.enquiryId;
        const message = req.body.message;

        const sql = `SELECT email FROM user_contacts WHERE user_id = ? AND id = ? LIMIT 1`;
        const VALUES = [userId, enquiryId];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.length > 0) {
            const email = rows[0].email
            await utility.sendMail(email, "testing subject", message);
            return apiResponse.successResponse(res, "Email Sent Successfully", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Enquiry not found");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const submitEnquiry =async (req:Request, res:Response) => {
    try {
        const { username, name, email, phone, message } = req.body;
        const createdAt = utility.dateWithFormat();

        const userSql = `SELECT id FROM users WHERE username = '${username}' LIMIT 1`;
        const [userRows]:any = await pool.query(userSql);
        if (userRows.length === 0) return apiResponse.errorMessage(res, 400, "Invalid username");
        const userId = userRows[0].id;

        const sql = `INSERT INTO user_contacts(user_id, name, email, phone_num, msg, created_at) VALUES(?, ?, ?, ?, ?, ?)`;
        const VALUES = [userId, name, email, phone, message, createdAt];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Success", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed!, try again");
        }
        
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res)
    }
}

// ====================================================================================================
// ====================================================================================================
