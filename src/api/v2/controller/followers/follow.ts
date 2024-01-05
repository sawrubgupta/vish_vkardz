import { Request, Response } from "express";
import pool from '../../../../dbV2';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';

export const followed =async (req:Request, res:Response) => {
     try {
        const userId = res.locals.jwt.userId;
        const followingId = req.body.followingId;
        const createdAt = utility.dateWithFormat();

        if (!followingId || followingId === undefined || followingId === null) {
            return apiResponse.errorMessage(res, 400, "Invalid Following Id");
        }
        const checkAccountQuery = `SELECT is_private FROM users WHERE id = ${followingId} LIMIT 1`;
        const [accountRows]:any = await pool.query(checkAccountQuery);
        if (accountRows[0].is_private === 1) {
            return apiResponse.errorMessage(res, 400, "Can't Follow Private Account");
        }

        const checkFollower = `SELECT id FROM user_followers WHERE user_id = ${followingId} AND follower_id = ${userId}`;
        const [followerRows]:any = await pool.query(checkFollower);

        if (followerRows.length > 0) {
            return apiResponse.errorMessage(res, 400, "Already followed!");
        }

        const sql = `INSERT INTO user_followers(user_id, follower_id, followed_at) VALUES(?, ?, ?)`;
        //here i an add follower id in user id because i follow another person and get him id as user id and  i am followed him so i am follower, so my user id save in follower id.
        const VALUES = [followingId, userId, createdAt];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Follow Successfully", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to Follow, try again!");
        }
     } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
     }
}

// ====================================================================================================
// ====================================================================================================

export const unfollow =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const followingId = req.body.followingId;

        if (!followingId || followingId === null) {
            return apiResponse.errorMessage(res, 400, "Invalid Following Id");
        }

        const checkFollowingSql = `SELECT id FROM user_followers WHERE follower_id = ${userId} AND user_id = ${followingId}`;
        const [followerRows]:any = await pool.query(checkFollowingSql);

        if (followerRows.length === 0) {
            return apiResponse.errorMessage(res, 400, "You Can't follow this account!!");
        }

        const unfollowQuery = `DELETE FROM user_followers WHERE follower_id = ${userId} AND user_id = ${followingId}`;
        const [rows]:any = await pool.query(unfollowQuery);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Unfollow Successfully", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Something Went wrong, please try again later");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const getFollowers =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;
        let keyword = req.query.keyword;

        var getPage:any = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page ) {
            page = 1;
        }
        var page_size: any = config.pageSize;       
        const offset = (page - 1 ) * page_size;

        const getPageQuery = `SELECT users.username, users.name, users.thumb FROM user_followers LEFT JOIN users ON user_followers.follower_id = users.id WHERE user_followers.user_id = ${userId} AND users.username LIKE '%${keyword}%'`;
        const [result]:any= await pool.query(getPageQuery);

        const sql = `SELECT users.username, users.name, users.thumb FROM user_followers LEFT JOIN users ON user_followers.follower_id = users.id WHERE user_followers.user_id = ${userId} AND users.username LIKE '%${keyword}%' ORDER BY user_followers.followed_at desc limit ${page_size} offset ${offset}`;
        const [rows]:any = await pool.query(sql);

        let totalPages:any = result.length/page_size;
        let totalPage = Math.ceil(totalPages);

        return res.status(200).json({
            status: true,
            data: rows,
            totalPage: totalPage,
            currentPage: page,
            totalLength: result.length,
            message: "Followers Get Successfully"
        })
        // if (rows.length > 0) {
        //     return apiResponse.successResponse(res, "Followers Get Successfully", rows);
        // } else {
        //     return apiResponse.successResponse(res, "Followers Get Successfully", []);
        // }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const getFollowings =async (req:Request, res:Response) => {      
    try {
        const userId = res.locals.jwt.userId;
        let keyword = req.query.keyword;

        var getPage:any = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page ) {
            page = 1;
        }
        var page_size: any = config.pageSize;       
        const offset = (page - 1 ) * page_size;

        const getPageQuery = `SELECT users.username, users.name, users.thumb FROM user_followers LEFT JOIN users ON user_followers.follower_id = users.id WHERE user_followers.follower_id = ${userId} AND users.username LIKE '%${keyword}%'`;
        const [result]:any= await pool.query(getPageQuery);

        const sql = `SELECT users.username, users.name, users.thumb FROM user_followers LEFT JOIN users ON user_followers.user_id = users.id WHERE user_followers.follower_id = ${userId} AND users.username LIKE '%${keyword}%' ORDER BY user_followers.followed_at desc limit ${page_size} offset ${offset}`;
        const [rows]:any = await pool.query(sql);

        let totalPages:any = result.length/page_size;
        let totalPage = Math.ceil(totalPages);

        return res.status(200).json({
            status: true,
            data: rows,
            totalPage: totalPage,
            currentPage: page,
            totalLength: result.length,
            message: "Following Get Successfully"
        })

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
