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
exports.leadList = exports.captureLead = exports.exchangeContactsList = exports.exchangeContacts = void 0;
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const development_1 = __importDefault(require("../../config/development"));
const responseMsg_1 = __importDefault(require("../../config/responseMsg"));
const contactsResMsg = responseMsg_1.default.features.contacts;
const exchangeContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, name, email, phone, message } = req.body;
        const createdAt = utility.dateWithFormat();
        const userSql = `SELECT id FROM users WHERE username = '${username}' LIMIT 1`;
        const [userRows] = yield dbV2_1.default.query(userSql);
        if (userRows.length === 0)
            return apiResponse.errorMessage(res, 400, contactsResMsg.exchangeContacts.invalidUsername);
        const userId = userRows[0].id;
        const sql = `INSERT INTO exchange_contacts(user_id, name, email, phone, message, created_at) VALUES(?, ?, ?, ?, ?, ?)`;
        const VALUES = [userId, name, email, phone, message, createdAt];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, contactsResMsg.exchangeContacts.successMsg, null);
        }
        else {
            return apiResponse.errorMessage(res, 400, contactsResMsg.exchangeContacts.failedMsg);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.exchangeContacts = exchangeContacts;
// ====================================================================================================
// ====================================================================================================
const exchangeContactsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId;
        const type = req.query.type; //type = business, user, null
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.query.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, contactsResMsg.exchangeContactsList.nullUserId);
        var getPage = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page) {
            page = 1;
        }
        var page_size = development_1.default.pageSize;
        const offset = (page - 1) * page_size;
        const getPageQuery = `SELECT COUNT(id) AS length FROM exchange_contacts WHERE user_id = ${userId}`;
        const [result] = yield dbV2_1.default.query(getPageQuery);
        const sql = `SELECT * FROM exchange_contacts WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT ${page_size} OFFSET ${offset}`;
        const [rows] = yield dbV2_1.default.query(sql);
        console.log(sql);
        let totalPages = result[0].length / page_size;
        let totalPage = Math.ceil(totalPages);
        // rows[totalPage] = totalPage;
        // rows['currentPage'] = page;
        // rows['totalLength'] = result[0].length;
        return apiResponse.successResponseWithPagination(res, contactsResMsg.exchangeContactsList.successMsg, rows, totalPage, page, result[0].length);
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.exchangeContactsList = exchangeContactsList;
// ====================================================================================================
// ====================================================================================================
const captureLead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, name, email, phone, message } = req.body;
        const createdAt = utility.dateWithFormat();
        const userSql = `SELECT id FROM users WHERE username = '${username}' LIMIT 1`;
        const [userRows] = yield dbV2_1.default.query(userSql);
        if (userRows.length === 0)
            return apiResponse.errorMessage(res, 400, contactsResMsg.captureLead.invalidUsername);
        const userId = userRows[0].id;
        const sql = `INSERT INTO leads(user_id, name, email, phone, message, created_at) VALUES(?, ?, ?, ?, ?, ?)`;
        const VALUES = [userId, name, email, phone, message, createdAt];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, contactsResMsg.captureLead.successMsg, null);
        }
        else {
            return apiResponse.errorMessage(res, 400, contactsResMsg.captureLead.failedMsg);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.captureLead = captureLead;
// ====================================================================================================
// ====================================================================================================
const leadList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId;
        const type = req.query.type; //type = business, user, null
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.query.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, contactsResMsg.leadList.nullUserId);
        var getPage = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page) {
            page = 1;
        }
        var page_size = development_1.default.pageSize;
        const offset = (page - 1) * page_size;
        const getPageQuery = `SELECT COUNT(id) AS length FROM leads WHERE user_id = ${userId}`;
        const [result] = yield dbV2_1.default.query(getPageQuery);
        const sql = `SELECT * FROM leads WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT ${page_size} OFFSET ${offset}`;
        const [rows] = yield dbV2_1.default.query(sql);
        console.log(sql);
        let totalPages = result[0].length / page_size;
        let totalPage = Math.ceil(totalPages);
        // rows[totalPage] = totalPage;
        // rows['currentPage'] = page;
        // rows['totalLength'] = result[0].length;
        return apiResponse.successResponseWithPagination(res, contactsResMsg.leadList.successMsg, rows, totalPage, page, result[0].length);
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.leadList = leadList;
// ====================================================================================================
// ====================================================================================================
