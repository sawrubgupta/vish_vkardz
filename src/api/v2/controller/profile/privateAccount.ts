import { Request, Response } from "express";
import pool from '../../../../dbV2';
import * as apiResponse from '../../helper/apiResponse';
import resMsg from '../../config/responseMsg';

const privateAccountResMsg = resMsg.profile.privateAccount;

export const switchToPublic =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const isPrivate = req.body.isPrivate;

        const sql = `UPDATE users SET is_private = ? WHERE id = ?`;
        const VALUES = [isPrivate, userId];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, privateAccountResMsg.switchToPublic.successMsg, null);
        } else {
            return apiResponse.errorMessage(res, 400, privateAccountResMsg.switchToPublic.failedMsg);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const privateProfile = async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const { profileId, isPrivate } = req.body;

        const sql = `UPDATE users_profile SET is_private = ? WHERE user_id = ? AND id = ?`;
        const VALUES = [isPrivate, userId, profileId];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, privateAccountResMsg.privateProfile.successMsg, null);
        } else {
            return apiResponse.errorMessage(res, 400, privateAccountResMsg.privateProfile.failedMsg);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================
