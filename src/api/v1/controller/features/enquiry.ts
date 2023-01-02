import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';


export const enquiryList =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        var getPage:any = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page ) {
            page = 1;
        }
        var page_size: any = config.pageSize;       
        const offset = (page - 1 ) * page_size;

        const getPageQuery = `SELECT id, name, email, phone_num, msg FROM user_contacts WHERE user_id = ${userId}`;
        const [result]:any= await pool.query(getPageQuery);

        const sql = `SELECT id, name, email, phone_num, msg FROM user_contacts WHERE user_id = ${userId} ORDER BY id DESC LIMIT ${page_size} OFFSET ${offset}`;
        const [rows]:any = await pool.query(sql);

        const getFeatureStatus = `SELECT status FROM users_features WHERE user_id = ${userId} AND feature_id = 11`;
        const [featureStatus]:any = await pool.query(getFeatureStatus);

        let totalPages:any = result.length/page_size;
        let totalPage = Math.ceil(totalPages);

        if (rows.length > 0) {
            return res.status(200).json({
                status: true,
                data: rows,
                featureStatus: featureStatus[0].status,
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
