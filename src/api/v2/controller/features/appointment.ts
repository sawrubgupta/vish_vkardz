import { Request, Response } from "express";
import pool from '../../../../dbV2';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';
import resMsg from '../../config/responseMsg';

const appointmentResMsg = resMsg.features.appointment;

export const appointmentList =async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        const profileId = req.query.profileId;
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, appointmentResMsg.appointmentList.nullUserId);

        var getPage:any = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page ) {
            page = 1;
        }
        var page_size: any = config.pageSize;       
        const offset = (page - 1 ) * page_size;

        const getPageQuery = `SELECT id, title, email, ap_date, ap_time, status, created_at FROM my_appointments WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [result]:any= await pool.query(getPageQuery);

        const sql = `SELECT id, title, email, ap_date, ap_time, status, created_at FROM my_appointments WHERE user_id = ${userId} AND profile_id = ${profileId} ORDER BY created_at DESC LIMIT ${page_size} OFFSET ${offset}`;
        const [rows]:any = await pool.query(sql);

        const getFeatureStatus = `SELECT status FROM users_features WHERE user_id = ${userId} AND profile_id = ${profileId} AND feature_id = 10`;
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
                message: appointmentResMsg.appointmentList.successMsg
            })
        } else {
            return res.status(200).json({
                status: true,
                data: null,
                featureStatus: featureStatus[0].status,
                totalPage: totalPage,
                currentPage: page,
                totalLength: result.length,
                message: appointmentResMsg.appointmentList.noDataFoundMsg
            })
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const deleteAppointment =async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.body.type; //type = business, user, null
        const profileId = req.body.profileId;

        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, appointmentResMsg.deleteAppointment.nullUserId);

        const appointmentId = req.body.appointmentId;
        if (!appointmentId || appointmentId === null || appointmentId === undefined) return apiResponse.errorMessage(res, 400, appointmentResMsg.deleteAppointment.nullAppointmentId);

        const sql = `DELETE FROM my_appointments WHERE user_id = ? AND id = ?`;
        const VALUES = [userId, appointmentId];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, appointmentResMsg.deleteAppointment.successMsg, null)
        } else {
            return apiResponse.errorMessage(res, 400, appointmentResMsg.deleteAppointment.failedMsg);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const manageAppointment =async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.body.type; //type = business, user, null
        const profileId = req.body.profileId;
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, appointmentResMsg.manageAppointment.nullUserId);

        const appointmentId = req.body.appointmentId;
        const status = req.body.status;

        const getppointmentQuery = `SELECT title AS name, email, ap_date, ap_time, status, created_at FROM my_appointments WHERE user_id = ${userId} AND id = ${appointmentId} LIMIT 1`;
        const [appointmentData]:any = await pool.query(getppointmentQuery);

        const sql = `UPDATE my_appointments SET status = ? WHERE user_id = ? AND id = ?`;
        const VALUES = [status, userId, appointmentId];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            const email = appointmentData[0].email;
            const name = appointmentData[0].name
    
            await utility.sendMail(email, "Appointment", `${name}, Your appointment was ${status}`);
            return apiResponse.successResponse(res, appointmentResMsg.manageAppointment.successMsg, null);
        } else {
            return apiResponse.errorMessage(res, 400, appointmentResMsg.manageAppointment.failedMsg);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const bookAppointment =async (req:Request, res:Response) => {
    try {
        let userId:any; 
        const type = req.body.type; //type = business, user, null
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, appointmentResMsg.bookAppointment.nullUserId);
        
        const createdAt = utility.dateWithFormat();
        const { profileId, name, email, date, time } = req.body;

        const sql = `INSERT INTO my_appointments(user_id, profile_id, title, email, ap_date, ap_time, created_at) VALUES(?, ?, ?, ?, ?, ?, ?)`;
        const VALUES = [userId, profileId, name, email, date, time, createdAt];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, appointmentResMsg.bookAppointment.successMsg, null);
        } else {
            return apiResponse.errorMessage(res, 400, appointmentResMsg.bookAppointment.failedMsg);
        }

    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const appointmentTimings =async (req:Request, res:Response) => {
    try {
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        const profileId = req.query.profileId;
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, appointmentResMsg.appointmentTimings.nullUserId);
        if (!profileId || profileId === null) return apiResponse.errorMessage(res, 400, appointmentResMsg.appointmentTimings.nullProfileId);
    
        const timingSql = `SELECT id, start_time, end_time, created_at FROM appointments WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [timingRows]:any = await pool.query(timingSql);
    
        return apiResponse.successResponse(res, appointmentResMsg.appointmentTimings.successMsg, timingRows);
    
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const deleteAppointmentTiming =async (req:Request, res:Response) => {
    try {
        let userId:any; 
        const type = req.body.type; //type = business, user, null
        const profileId = req.body.profileId;
        const timingId = req.body.timingId;
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, appointmentResMsg.deleteAppointmentTiming.nullUserId);
        if (!timingId || timingId === null) return apiResponse.errorMessage(res, 400, appointmentResMsg.deleteAppointmentTiming.invalidId);
        
        const sql = `DELETE FROM appointments WHERE user_id = ${userId} AND id = ${timingId}`;
        const [rows]:any = await pool.query(sql);
        
        return apiResponse.successResponse(res, appointmentResMsg.deleteAppointmentTiming.successMsg, null);
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const addTiming =async (req:Request, res:Response) => {
    try {
        let userId:any; 
        const type = req.body.type; //type = business, user, null
        // const timingId = req.query.timingId;
        const { profileId, startTime, endTime } = req.body;
        const createdAt = utility.dateWithFormat();
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, appointmentResMsg.addTiming.nullUserId);

        // const timingSql = `SELECT id FROM appointments WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        // const [timingRows]:any = await pool.query(timingSql);
        // if (timingRows.length > 0) return apiResponse.errorMessage(res, 400, "Limit exceed")

        const sql = `INSERT INTO appointments(user_id, profile_id, start_time, end_time, created_at) VALUES(?, ?, ?, ?, ?)`;
        const VALUES = [userId, profileId, startTime, endTime, createdAt];
        const [rows]:any = await pool.query(sql,VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, appointmentResMsg.addTiming.successMsg, null);
        } else {
            return apiResponse.errorMessage(res, 400, appointmentResMsg.addTiming.failedMsg);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const updateTiming =async (req:Request, res:Response) => {
    try {
        let userId:any; 
        const type = req.body.type; //type = business, user, null
        const { profileId, timingId, startTime, endTime } = req.body;
        const createdAt = utility.dateWithFormat();
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, appointmentResMsg.updateTiming.nullUserId);

        // const timingSql = `SELECT id FROM appointments WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        // const [timingRows]:any = await pool.query(timingSql);
        // if (timingRows.length > 0) return apiResponse.errorMessage(res, 400, "Limit exceed")

        const sql = `UPDATE appointments SET start_time = ?, end_time = ? WHERE user_id = ? AND id = ?`;
        const VALUES = [startTime, endTime, userId, timingId];
        const [rows]:any = await pool.query(sql,VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, appointmentResMsg.updateTiming.successMsg, null);
        } else {
            return apiResponse.errorMessage(res, 400, appointmentResMsg.updateTiming.failedMsg);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================
