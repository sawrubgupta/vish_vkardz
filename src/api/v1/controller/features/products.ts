import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';


export const addProduct =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        const createdAt = utility.dateWithFormat();
        const {title, description, price, image} = req.body;

        const sql = `INSERT INTO services(user_id, title, images, overview, price, status, created_at) VALUES(?, ?, ?, ?, ?, ?, ?)`;
        const VALUES = [userId, title, image, description, price, 1, createdAt];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Product Added Successfully", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to add product, try again");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const getProducts =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        var getPage:any = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page ) {
            page = 1;
        }
        var page_size: any = config.pageSize;       
        const offset = (page - 1 ) * page_size;

        const getPageQuery = `SELECT id, title, overview as description, images, price, status FROM services WHERE user_id = ${userId}`;
        const [result]:any= await pool.query(getPageQuery);

        const sql = `SELECT id, title, overview as description, images, price, status FROM services WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT ${page_size} OFFSET ${offset}`;
        const [rows]:any = await pool.query(sql);

        let totalPages:any = result.length/page_size;
        let totalPage = Math.ceil(totalPages);

        const getFeatureStatus = `SELECT status FROM users_features WHERE user_id = ${userId} AND feature_id = 5`;
        const [featureStatus]:any = await pool.query(getFeatureStatus);

        if (rows.length > 0) {
            // return apiResponse.successResponse(res, "Data Retrieved Successflly", rows);
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
            // return apiResponse.successResponse(res, "No Data Found", null);
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

export const updateProduct =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        const productId = req.query.productId;
        const {title, description, price, image} = req.body;

        const sql = `UPDATE services SET title = ?, overview = ?, price = ?, images = ? WHERE user_id = ? AND id = ?`;
        const VALUES = [title, description, price, image, userId, productId];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Product Updated Successfully", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to Update Product, try again");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const deleteProduct =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        const productId = req.query.productId;

        const sql = `DELETE FROM services WHERE user_id = ? AND id = ?`;
        const VALUES = [userId, productId];
        const [rows]:any = await pool.query(sql, VALUES);

        return apiResponse.successResponse(res, "Product Deleted Successfully", null);
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================