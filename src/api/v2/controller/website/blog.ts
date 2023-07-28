import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';

export const blogList =async (req:Request, res:Response) => {
    try {
        // const categorySql = `SELECT * FROM blog_categories WHERE status = 1`;
        // const [categoryRows]:any = await pool.query(categorySql);

        var getPage: any = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page) {
            page = 1;
        }
        var page_size: any = config.pageSize;
        const offset = (page - 1) * page_size;

        const getPageQuery = `SELECT COUNT(id) AS totalLength FROM blog_post WHERE status = 1`;
        const [result]: any = await pool.query(getPageQuery);

        const sql = `SELECT * FROM blog_post WHERE status = 1 ORDER BY id limit ${page_size} offset ${offset}`;
        const [rows]:any = await pool.query(sql);

        let totalPages: any = result[0].totalLength / page_size;
        let totalPage = Math.ceil(totalPages);

        return res.status(200).json({
            status: true,
            data: rows,
            totalPage: totalPage,
            currentPage: page,
            totalLength: result[0].totalLength,
            message: "Products details are here"
        })

    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================
