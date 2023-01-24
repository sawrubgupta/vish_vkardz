import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';


export const appointmentList =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        var getPage:any = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page ) {
            page = 1;
        }
        var page_size: any = config.pageSize;       
        const offset = (page - 1 ) * page_size;

        const getPageQuery = `SELECT id, title, email, ap_date, ap_time, status, created_at FROM my_appointments WHERE user_id = ${userId}`;
        const [result]:any= await pool.query(getPageQuery);

        const sql = `SELECT id, title, email, ap_date, ap_time, created_at FROM my_appointments WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT ${page_size} OFFSET ${offset}`;
        const [rows]:any = await pool.query(sql);

        const getFeatureStatus = `SELECT status FROM users_features WHERE user_id = ${userId} AND feature_id = 10`;
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

export const deleteAppointment =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        const appointmentId = req.body.appointmentId;

        const sql = `DELETE FROM my_appointments WHERE user_id = ? AND id = ?`;
        const VALUES = [userId, appointmentId];
        const [rows]:any = await pool.query(sql, VALUES);

        return apiResponse.successResponse(res, "Appointment deleted successfully", null)
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const manageAppointment =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
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
            return apiResponse.successResponse(res, "success", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Please try again later!!")
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
