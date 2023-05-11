import { Request, Response } from "express";
import pool from "../../../../db";
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config from "../../config/development";
import md5 from "md5";

export const userList =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;

        const keyword = req.query.keyword;
        var getPage: any = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page) {
            page = 1;
        }
        var page_size: any = config.pageSize;
        const offset = (page - 1) * page_size;

        const getPageQuery = `SELECT id FROM users WHERE admin_id = ${userId}`;
        const [result]: any = await pool.query(getPageQuery);

        const sql = `SELECT id, username, name, email, phone, designation, website, account_type, thumb, cover_photo, primary_profile_link, display_dial_code, display_email, display_number FROM users WHERE admin_id = ${userId} AND (username LIKE '%${keyword}%' OR name LIKE '%${keyword}%') ORDER BY username asc limit ${page_size} offset ${offset}`;
        const [rows]:any = await pool.query(sql);

        const adminSql = `SELECT * FROM business_admin WHERE id = ${userId} LIMIT 1`;
        const [adminRows]:any = await pool.query(adminSql);

        let totalPages: any = result.length / page_size;
        let totalPage = Math.ceil(totalPages);

        return res.status(200).json({
            status: true,
            data: rows,
            adminData: adminRows,
            totalPage: totalPage,
            currentPage: page,
            totalLength: result.length,
            message: "Users list are here"
        })
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const userDetail =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;


        const sql = `SELECT id, username, name, email, phone, designation, website, thumb, cover_photo, company_name, address, primary_profile_link, website,  FROM users WHERE admin_id = ${userId} `;
        const [rows]:any = await pool.query(sql);

        return apiResponse.successResponse(res, "Data retrieved Successfully", null);
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const updateUser = async (req:Request, res:Response) => {
    try {
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
        const { username, email, phone } = req.body;

        const emailSql = `SELECT username, email, phone FROM users where deleted_at IS NULL AND id != ? AND (email = ? or username = ? or phone = ?) LIMIT 1`;
        const emailValues = [userId, email, username, phone]

        const [data]:any = await pool.query(emailSql, emailValues);

        const dupli = [];
        if (data.length > 0) {
            if (data[0].email === email) {
                dupli.push("email");
            }
            if (data[0].username === username) {
                dupli.push("username");
            }
            if (data[0].phone === phone) {
                dupli.push("phone");
            }
            console.log(dupli);
            
            const msg = `${dupli.join()} is duplicate, Please change it`;
            return res.status(400).json({
                status: false,
                data: null,
                message: msg,
            });
        }

        const checkUserSql = `SELECT name FROM users WHERE id = ${userId} LIMIT 1`;
        const [userData]:any = await pool.query(checkUserSql);
        if (userData.length > 0) {
            const updateSql = `UPDATE users SET username = ?, email = ?, phone = ? WHERE id = ?`;
            const VALUES = [username, email, phone, userId];
            const [rows]:any = await pool.query(updateSql, VALUES);
            if (rows.affectedRows > 0) {
                return apiResponse.successResponse(res, "Updated Successfully", null);
            } else {
                return apiResponse.errorMessage(res, 400, "Failed to update, try again");
            }

        } else {
            return apiResponse.errorMessage(res, 400, "User not found!");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const updateAdmin = async (req:Request, res:Response) => {
    try {
        let userId = res.locals.jwt.userId;

        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "User Id is required!");
        }
        const { name, email, phone, image, company, designation, cin_number, gst_number} = req.body;

        const emailSql = `SELECT email, phone FROM business_admin WHERE deleted_at IS NULL AND id != ? AND (email = ? or phone = ?) LIMIT 1`;
        const emailValues = [userId, email, phone]

        const [data]:any = await pool.query(emailSql, emailValues);

        const dupli = [];
        if (data.length > 0) {
            if (data[0].email === email) {
                dupli.push("email");
            }
            if (data[0].phone === phone) {
                dupli.push("phone");
            }
            console.log(dupli);
            
            const msg = `${dupli.join()} is duplicate, Please change it`;
            return res.status(400).json({
                status: false,
                data: null,
                message: msg,
            });
        }

        const checkUserSql = `SELECT name FROM business_admin WHERE id = ${userId} LIMIT 1`;
        const [userData]:any = await pool.query(checkUserSql);
        if (userData.length > 0) {
            const updateSql = `UPDATE business_admin SET name = ?, email = ?, phone = ?, image = ?, company = ?, designation = ?, cin_number = ?, gst_number = ? WHERE id = ?`;
            const VALUES = [name, email, phone, image, company, designation, cin_number, gst_number, userId];
            const [rows]:any = await pool.query(updateSql, VALUES);
            if (rows.affectedRows > 0) {
                return apiResponse.successResponse(res, "Updated Successfully", null);
            } else {
                return apiResponse.errorMessage(res, 400, "Failed to update, try again");
            }

        } else {
            return apiResponse.errorMessage(res, 400, "User not found!");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const adminProfile =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;

        const adminSql = `SELECT * FROM business_admin WHERE id = ${userId} LIMIT 1`;
        const [adminRows]:any = await pool.query(adminSql);

        return apiResponse.successResponse(res, "Data retrieved Successfully", adminRows[0])
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
