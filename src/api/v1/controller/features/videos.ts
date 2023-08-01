import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';

export const addVideos = async (req:Request, res:Response) => {
    try {
        // const userId = res.locals.jwt.userId;
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
        const createdAt = utility.dateWithFormat();
        const { videoType, url, thumbnail } = req.body;

        const sql = `INSERT INTO videos(user_id, type, url, thumbnail, created_at) VALUES(?, ?, ?, ?, ?)`;
        const VALUES = [userId, videoType, url, thumbnail, createdAt];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Video added successfully", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed!, try again");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const getVideos =async (req:Request, res:Response) => {
    try {
        let userId
        const type = req.query.type; //type = business, user, null
        if (type && type === config.businessType) {
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

        const pageQuery = `SELECT COUNT(id) AS length FROM videos WHERE user_id = ${userId}`;
        const [result]:any = await pool.query(pageQuery);

        const sql = `SELECT * FROM videos WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT ${page_size} OFFSET ${offset}`;
        const [rows]:any = await pool.query(sql);

        let totalPages:any = result[0].length/page_size;
        let totalPage = Math.ceil(totalPages);

        if (rows.length > 0) {
            return res.status(200).json({
                status: true,
                data: rows,
                totalPage: totalPage,
                currentPage: page,
                totalLength: result[0].length,
                message: "Data Retrieved Successflly"
            })
        } else {
            return res.status(200).json({
                status: true,
                data: null,
                totalPage: totalPage,
                currentPage: page,
                totalLength: result[0].length,
                message: "No data found"
            })
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const deleteVideos = async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const videoId = req.body.videoId;

        const sql = `DELETE FROM videos WHERE user_id = ${userId} AND id = ${videoId}`;
        const [rows]:any = await pool.query(sql);

        return apiResponse.successResponse(res, "Video Deleted Successfully", null);
    } catch (error) {
        console.log(error);       
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================
