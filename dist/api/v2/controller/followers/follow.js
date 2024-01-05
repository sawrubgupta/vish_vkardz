"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFollowings = exports.getFollowers = exports.unfollow = exports.followed = void 0;
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const development_1 = __importDefault(require("../../config/development"));
const followed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const followingId = req.body.followingId;
        const createdAt = utility.dateWithFormat();
        if (!followingId || followingId === undefined || followingId === null) {
            return apiResponse.errorMessage(res, 400, "Invalid Following Id");
        }
        const checkAccountQuery = `SELECT is_private FROM users WHERE id = ${followingId} LIMIT 1`;
        const [accountRows] = yield dbV2_1.default.query(checkAccountQuery);
        if (accountRows[0].is_private === 1) {
            return apiResponse.errorMessage(res, 400, "Can't Follow Private Account");
        }
        const checkFollower = `SELECT id FROM user_followers WHERE user_id = ${followingId} AND follower_id = ${userId}`;
        const [followerRows] = yield dbV2_1.default.query(checkFollower);
        if (followerRows.length > 0) {
            return apiResponse.errorMessage(res, 400, "Already followed!");
        }
        const sql = `INSERT INTO user_followers(user_id, follower_id, followed_at) VALUES(?, ?, ?)`;
        //here i an add follower id in user id because i follow another person and get him id as user id and  i am followed him so i am follower, so my user id save in follower id.
        const VALUES = [followingId, userId, createdAt];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Follow Successfully", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to Follow, try again!");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.followed = followed;
// ====================================================================================================
// ====================================================================================================
const unfollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const followingId = req.body.followingId;
        if (!followingId || followingId === null) {
            return apiResponse.errorMessage(res, 400, "Invalid Following Id");
        }
        const checkFollowingSql = `SELECT id FROM user_followers WHERE follower_id = ${userId} AND user_id = ${followingId}`;
        const [followerRows] = yield dbV2_1.default.query(checkFollowingSql);
        if (followerRows.length === 0) {
            return apiResponse.errorMessage(res, 400, "You Can't follow this account!!");
        }
        const unfollowQuery = `DELETE FROM user_followers WHERE follower_id = ${userId} AND user_id = ${followingId}`;
        const [rows] = yield dbV2_1.default.query(unfollowQuery);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Unfollow Successfully", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Something Went wrong, please try again later");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.unfollow = unfollow;
// ====================================================================================================
// ====================================================================================================
const getFollowers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        let keyword = req.query.keyword;
        var getPage = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page) {
            page = 1;
        }
        var page_size = development_1.default.pageSize;
        const offset = (page - 1) * page_size;
        const getPageQuery = `SELECT users.username, users.name, users.thumb FROM user_followers LEFT JOIN users ON user_followers.follower_id = users.id WHERE user_followers.user_id = ${userId} AND users.username LIKE '%${keyword}%'`;
        const [result] = yield dbV2_1.default.query(getPageQuery);
        const sql = `SELECT users.username, users.name, users.thumb FROM user_followers LEFT JOIN users ON user_followers.follower_id = users.id WHERE user_followers.user_id = ${userId} AND users.username LIKE '%${keyword}%' ORDER BY user_followers.followed_at desc limit ${page_size} offset ${offset}`;
        const [rows] = yield dbV2_1.default.query(sql);
        let totalPages = result.length / page_size;
        let totalPage = Math.ceil(totalPages);
        return res.status(200).json({
            status: true,
            data: rows,
            totalPage: totalPage,
            currentPage: page,
            totalLength: result.length,
            message: "Followers Get Successfully"
        });
        // if (rows.length > 0) {
        //     return apiResponse.successResponse(res, "Followers Get Successfully", rows);
        // } else {
        //     return apiResponse.successResponse(res, "Followers Get Successfully", []);
        // }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.getFollowers = getFollowers;
// ====================================================================================================
// ====================================================================================================
const getFollowings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        let keyword = req.query.keyword;
        var getPage = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page) {
            page = 1;
        }
        var page_size = development_1.default.pageSize;
        const offset = (page - 1) * page_size;
        const getPageQuery = `SELECT users.username, users.name, users.thumb FROM user_followers LEFT JOIN users ON user_followers.follower_id = users.id WHERE user_followers.follower_id = ${userId} AND users.username LIKE '%${keyword}%'`;
        const [result] = yield dbV2_1.default.query(getPageQuery);
        const sql = `SELECT users.username, users.name, users.thumb FROM user_followers LEFT JOIN users ON user_followers.user_id = users.id WHERE user_followers.follower_id = ${userId} AND users.username LIKE '%${keyword}%' ORDER BY user_followers.followed_at desc limit ${page_size} offset ${offset}`;
        const [rows] = yield dbV2_1.default.query(sql);
        let totalPages = result.length / page_size;
        let totalPage = Math.ceil(totalPages);
        return res.status(200).json({
            status: true,
            data: rows,
            totalPage: totalPage,
            currentPage: page,
            totalLength: result.length,
            message: "Following Get Successfully"
        });
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.getFollowings = getFollowings;
// ====================================================================================================
// ====================================================================================================
