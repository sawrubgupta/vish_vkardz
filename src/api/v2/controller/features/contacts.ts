import { Request, Response } from "express";
import pool from '../../../../dbV2';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';
import resMsg from '../../config/responseMsg';

const contactsResMsg = resMsg.features.contacts;


export const exchangeContacts =async (req:Request, res:Response) => {
    try {
        const { username, name, email, phone, message } = req.body;
        const createdAt = utility.dateWithFormat();

        const userSql = `SELECT id FROM users WHERE username = '${username}' LIMIT 1`;
        const [userRows]:any = await pool.query(userSql);
        if (userRows.length === 0) return apiResponse.errorMessage(res, 400, contactsResMsg.exchangeContacts.invalidUsername);
        const userId = userRows[0].id;

        const sql = `INSERT INTO exchange_contacts(user_id, name, email, phone, message, created_at) VALUES(?, ?, ?, ?, ?, ?)`;
        const VALUES = [userId, name, email, phone, message, createdAt];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, contactsResMsg.exchangeContacts.successMsg, null);
        } else {
            return apiResponse.errorMessage(res, 400, contactsResMsg.exchangeContacts.failedMsg);
        }
        
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res)
    }
}

// ====================================================================================================
// ====================================================================================================

export const exchangeContactsList =async (req:Request, res:Response) => {
    try {
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, contactsResMsg.exchangeContactsList.nullUserId);

        var getPage:any = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page ) {
            page = 1;
        }
        var page_size: any = config.pageSize;       
        const offset = (page - 1 ) * page_size;

        const getPageQuery = `SELECT COUNT(id) AS length FROM exchange_contacts WHERE user_id = ${userId}`;
        const [result]:any= await pool.query(getPageQuery);

        const sql = `SELECT * FROM exchange_contacts WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT ${page_size} OFFSET ${offset}`;
        const [rows]:any = await pool.query(sql);

        console.log(sql);
        
        let totalPages:any = result[0].length/page_size;
        let totalPage = Math.ceil(totalPages);

        // rows[totalPage] = totalPage;
        // rows['currentPage'] = page;
        // rows['totalLength'] = result[0].length;

        return apiResponse.successResponseWithPagination(res, contactsResMsg.exchangeContactsList.successMsg, rows, totalPage, page, result[0].length);
        
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res)
    }
}

// ====================================================================================================
// ====================================================================================================

export const captureLead =async (req:Request, res:Response) => {
    try {
        const { username, name, email, phone, message } = req.body;
        const createdAt = utility.dateWithFormat();

        const userSql = `SELECT id FROM users WHERE username = '${username}' LIMIT 1`;
        const [userRows]:any = await pool.query(userSql);
        if (userRows.length === 0) return apiResponse.errorMessage(res, 400, contactsResMsg.captureLead.invalidUsername);
        const userId = userRows[0].id;

        const sql = `INSERT INTO leads(user_id, name, email, phone, message, created_at) VALUES(?, ?, ?, ?, ?, ?)`;
        const VALUES = [userId, name, email, phone, message, createdAt];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, contactsResMsg.captureLead.successMsg, null);
        } else {
            return apiResponse.errorMessage(res, 400, contactsResMsg.captureLead.failedMsg);
        }
        
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res)
    }
}

// ====================================================================================================
// ====================================================================================================

export const leadList =async (req:Request, res:Response) => {
    try {
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, contactsResMsg.leadList.nullUserId);

        var getPage:any = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page ) {
            page = 1;
        }
        var page_size: any = config.pageSize;       
        const offset = (page - 1 ) * page_size;

        const getPageQuery = `SELECT COUNT(id) AS length FROM leads WHERE user_id = ${userId}`;
        const [result]:any= await pool.query(getPageQuery);

        const sql = `SELECT * FROM leads WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT ${page_size} OFFSET ${offset}`;
        const [rows]:any = await pool.query(sql);

        console.log(sql);
        
        let totalPages:any = result[0].length/page_size;
        let totalPage = Math.ceil(totalPages);

        // rows[totalPage] = totalPage;
        // rows['currentPage'] = page;
        // rows['totalLength'] = result[0].length;

        return apiResponse.successResponseWithPagination(res, contactsResMsg.leadList.successMsg, rows, totalPage, page, result[0].length);
        
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res)
    }
}

// ====================================================================================================
// ====================================================================================================
