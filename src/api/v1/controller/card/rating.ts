import pool from '../../../../db';
import { Request, Response } from "express";
import * as apiResponse from '../../helper/apiResponse';
import config  from '../../config/development';
import * as utility from "../../helper/utility";

export const productRating =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;        
        const { productId, rating, message } = req.body;
        const createdAt = utility.dateWithFormat();

        const checkProductBuySql = `SELECT id FROM orderlist WHERE user_id = ${userId} AND product_id = ${productId} LIMIT 1`;
        const [orderData]:any = await pool.query(checkProductBuySql);

        if (orderData.length === 0) {
            return apiResponse.errorMessage(res, 400, "Sorry! You are not allowed to review this product since you haven't bought it.")
        }

        const checkReviewSql = `SELECT id FROM product_rating WHERE user_id = ${userId} AND product_id = ${productId} LIMIT 1`;
        const [reviewData]:any = await pool.query(checkReviewSql);

        if (reviewData.length > 0) {
            return apiResponse.errorMessage(res, 400, "Already review!");
        }

        const sql = `INSERT INTO product_rating(user_id, product_id, rating, message, created_at) VALUES(?, ?, ?, ?, ?)`;
        const VALUES = [userId, productId, rating, message, createdAt];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Rated Successfully", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed!!, Please try again");
        }

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something wnt wrong")
    }
}
// ====================================================================================================
// ====================================================================================================

export const reviewList =async (req:Request, res:Response) => {
    const productId = req.query.productId;

    const sql = `SELECT product_rating.id AS reviewId, users.name, product_rating.rating, product_rating.message FROM product_rating LEFT JOIN users ON product_rating.user_id = users.id WHERE product_rating.product_id = ${productId}`;
    const [rows]:any = await pool.query(sql);

    if (rows.length > 0) {
        return apiResponse.successResponse(res, "Success", rows);
    } else {
        return apiResponse.successResponse(res, "No Reviews Found", []);
    }
}

// ====================================================================================================
// ====================================================================================================

export const updateProductReviews =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;        
        const { productId, rating, message } = req.body;

        const sql = `UPDATE product_rating SET rating = ?, message = ? WHERE user_id = ? AND product_id = ?`;
        const VALUES = [rating, message, userId, productId];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Review updated successfully", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to update, Please try again!");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
