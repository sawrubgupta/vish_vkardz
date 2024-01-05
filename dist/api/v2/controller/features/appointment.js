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
exports.updateTiming = exports.addTiming = exports.deleteAppointmentTiming = exports.appointmentTimings = exports.bookAppointment = exports.manageAppointment = exports.deleteAppointment = exports.appointmentList = void 0;
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const development_1 = __importDefault(require("../../config/development"));
const responseMsg_1 = __importDefault(require("../../config/responseMsg"));
const appointmentResMsg = responseMsg_1.default.features.appointment;
const appointmentList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId;
        const type = req.query.type; //type = business, user, null
        const profileId = req.query.profileId;
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.query.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, appointmentResMsg.appointmentList.nullUserId);
        var getPage = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page) {
            page = 1;
        }
        var page_size = development_1.default.pageSize;
        const offset = (page - 1) * page_size;
        const getPageQuery = `SELECT id, title, email, ap_date, ap_time, status, created_at FROM my_appointments WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [result] = yield dbV2_1.default.query(getPageQuery);
        const sql = `SELECT id, title, email, ap_date, ap_time, status, created_at FROM my_appointments WHERE user_id = ${userId} AND profile_id = ${profileId} ORDER BY created_at DESC LIMIT ${page_size} OFFSET ${offset}`;
        const [rows] = yield dbV2_1.default.query(sql);
        const getFeatureStatus = `SELECT status FROM users_features WHERE user_id = ${userId} AND profile_id = ${profileId} AND feature_id = 10`;
        const [featureStatus] = yield dbV2_1.default.query(getFeatureStatus);
        let totalPages = result.length / page_size;
        let totalPage = Math.ceil(totalPages);
        if (rows.length > 0) {
            return res.status(200).json({
                status: true,
                data: rows,
                featureStatus: featureStatus[0].status,
                totalPage: totalPage,
                currentPage: page,
                totalLength: result.length,
                message: appointmentResMsg.appointmentList.successMsg
            });
        }
        else {
            return res.status(200).json({
                status: true,
                data: null,
                featureStatus: featureStatus[0].status,
                totalPage: totalPage,
                currentPage: page,
                totalLength: result.length,
                message: appointmentResMsg.appointmentList.noDataFoundMsg
            });
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.appointmentList = appointmentList;
// ====================================================================================================
// ====================================================================================================
const deleteAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId;
        const type = req.body.type; //type = business, user, null
        const profileId = req.body.profileId;
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.body.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, appointmentResMsg.deleteAppointment.nullUserId);
        const appointmentId = req.body.appointmentId;
        if (!appointmentId || appointmentId === null || appointmentId === undefined)
            return apiResponse.errorMessage(res, 400, appointmentResMsg.deleteAppointment.nullAppointmentId);
        const sql = `DELETE FROM my_appointments WHERE user_id = ? AND id = ?`;
        const VALUES = [userId, appointmentId];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, appointmentResMsg.deleteAppointment.successMsg, null);
        }
        else {
            return apiResponse.errorMessage(res, 400, appointmentResMsg.deleteAppointment.failedMsg);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.deleteAppointment = deleteAppointment;
// ====================================================================================================
// ====================================================================================================
const manageAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId;
        const type = req.body.type; //type = business, user, null
        const profileId = req.body.profileId;
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.body.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, appointmentResMsg.manageAppointment.nullUserId);
        const appointmentId = req.body.appointmentId;
        const status = req.body.status;
        const getppointmentQuery = `SELECT title AS name, email, ap_date, ap_time, status, created_at FROM my_appointments WHERE user_id = ${userId} AND id = ${appointmentId} LIMIT 1`;
        const [appointmentData] = yield dbV2_1.default.query(getppointmentQuery);
        const sql = `UPDATE my_appointments SET status = ? WHERE user_id = ? AND id = ?`;
        const VALUES = [status, userId, appointmentId];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            const email = appointmentData[0].email;
            const name = appointmentData[0].name;
            yield utility.sendMail(email, "Appointment", `${name}, Your appointment was ${status}`);
            return apiResponse.successResponse(res, appointmentResMsg.manageAppointment.successMsg, null);
        }
        else {
            return apiResponse.errorMessage(res, 400, appointmentResMsg.manageAppointment.failedMsg);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.manageAppointment = manageAppointment;
// ====================================================================================================
// ====================================================================================================
const bookAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId;
        const type = req.body.type; //type = business, user, null
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.body.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, appointmentResMsg.bookAppointment.nullUserId);
        const createdAt = utility.dateWithFormat();
        const { profileId, name, email, date, time } = req.body;
        const sql = `INSERT INTO my_appointments(user_id, profile_id, title, email, ap_date, ap_time, created_at) VALUES(?, ?, ?, ?, ?, ?, ?)`;
        const VALUES = [userId, profileId, name, email, date, time, createdAt];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, appointmentResMsg.bookAppointment.successMsg, null);
        }
        else {
            return apiResponse.errorMessage(res, 400, appointmentResMsg.bookAppointment.failedMsg);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.bookAppointment = bookAppointment;
// ====================================================================================================
// ====================================================================================================
const appointmentTimings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId;
        const type = req.query.type; //type = business, user, null
        const profileId = req.query.profileId;
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.query.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, appointmentResMsg.appointmentTimings.nullUserId);
        if (!profileId || profileId === null)
            return apiResponse.errorMessage(res, 400, appointmentResMsg.appointmentTimings.nullProfileId);
        const timingSql = `SELECT id, start_time, end_time, created_at FROM appointments WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [timingRows] = yield dbV2_1.default.query(timingSql);
        return apiResponse.successResponse(res, appointmentResMsg.appointmentTimings.successMsg, timingRows);
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.appointmentTimings = appointmentTimings;
// ====================================================================================================
// ====================================================================================================
const deleteAppointmentTiming = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId;
        const type = req.body.type; //type = business, user, null
        const profileId = req.body.profileId;
        const timingId = req.body.timingId;
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.body.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, appointmentResMsg.deleteAppointmentTiming.nullUserId);
        if (!timingId || timingId === null)
            return apiResponse.errorMessage(res, 400, appointmentResMsg.deleteAppointmentTiming.invalidId);
        const sql = `DELETE FROM appointments WHERE user_id = ${userId} AND id = ${timingId}`;
        const [rows] = yield dbV2_1.default.query(sql);
        return apiResponse.successResponse(res, appointmentResMsg.deleteAppointmentTiming.successMsg, null);
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.deleteAppointmentTiming = deleteAppointmentTiming;
// ====================================================================================================
// ====================================================================================================
const addTiming = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId;
        const type = req.body.type; //type = business, user, null
        // const timingId = req.query.timingId;
        const { profileId, startTime, endTime } = req.body;
        const createdAt = utility.dateWithFormat();
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.body.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, appointmentResMsg.addTiming.nullUserId);
        // const timingSql = `SELECT id FROM appointments WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        // const [timingRows]:any = await pool.query(timingSql);
        // if (timingRows.length > 0) return apiResponse.errorMessage(res, 400, "Limit exceed")
        const sql = `INSERT INTO appointments(user_id, profile_id, start_time, end_time, created_at) VALUES(?, ?, ?, ?, ?)`;
        const VALUES = [userId, profileId, startTime, endTime, createdAt];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, appointmentResMsg.addTiming.successMsg, null);
        }
        else {
            return apiResponse.errorMessage(res, 400, appointmentResMsg.addTiming.failedMsg);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.addTiming = addTiming;
// ====================================================================================================
// ====================================================================================================
const updateTiming = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId;
        const type = req.body.type; //type = business, user, null
        const { profileId, timingId, startTime, endTime } = req.body;
        const createdAt = utility.dateWithFormat();
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.body.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, appointmentResMsg.updateTiming.nullUserId);
        // const timingSql = `SELECT id FROM appointments WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        // const [timingRows]:any = await pool.query(timingSql);
        // if (timingRows.length > 0) return apiResponse.errorMessage(res, 400, "Limit exceed")
        const sql = `UPDATE appointments SET start_time = ?, end_time = ? WHERE user_id = ? AND id = ?`;
        const VALUES = [startTime, endTime, userId, timingId];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, appointmentResMsg.updateTiming.successMsg, null);
        }
        else {
            return apiResponse.errorMessage(res, 400, appointmentResMsg.updateTiming.failedMsg);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.updateTiming = updateTiming;
// ====================================================================================================
// ====================================================================================================
