import { Request, Response } from "express";
import pool from "../../../../db";
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config from "../../config/development";
import md5 from "md5";

export const userList =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;

        console.log(userId);
        
        var getPage: any = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page) {
            page = 1;
        }
        var page_size: any = config.pageSize;
        const offset = (page - 1) * page_size;

        const getPageQuery = `SELECT id FROM users WHERE admin_id = ${userId}`;
        const [result]: any = await pool.query(getPageQuery);

        const sql = `SELECT id, username, name, email, phone, designation, website, thumb, cover_photo, primary_profile_link FROM users WHERE admin_id = ${userId} ORDER BY username asc limit ${page_size} offset ${offset}`;
        const [rows]:any = await pool.query(sql);

        let totalPages: any = result.length / page_size;
        let totalPage = Math.ceil(totalPages);

        return res.status(200).json({
            status: true,
            data: rows,
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
