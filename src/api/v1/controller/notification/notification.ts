import pool from "../../../../db";
import { Request, Response } from "express";
import * as apiResponse from '../../helper/apiResponse';
// import { dateWithFormat } from "../utility/utility";
// import fcmSend from "../../helper/notification";
import config from '../../config/development';

export const getNotification =async (req:Request, res: Response) => {
    try {
        const userId = res.locals.jwt.userId;
        let keyword = req.query.keyword;

        var getPage: any = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page) {
            page = 1;
        }
        var page_size: any = config.pageSize;
        const offset = (page - 1) * page_size;

        const getPageQuery = `SELECT id FROM notifications WHERE user_id = ${userId}`;
        const [result]: any = await pool.query(getPageQuery);

        const sql = `SELECT * FROM notifications WHERE user_id = ${userId} ORDER BY created_at desc limit ${page_size} offset ${offset}`;
        const [rows]:any = await pool.query(sql);

        let totalPages: any = result.length / page_size;
        let totalPage = Math.ceil(totalPages);

        if (rows.length > 0) {
            // return apiResponse.successResponse(res, "Products details are here", rows);
            return res.status(200).json({
                status: true,
                data: rows,
                totalPage: totalPage,
                currentPage: page,
                totalLength: result.length,
                message: "Products details are here"
            })
        } else {
            return apiResponse.errorMessage(res, 400, "Data not found");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
}