import {Request, Response, NextFunction} from "express";
import pool from "../../../../dbV2";
import * as utility from "../../helper/utility";
import * as apiResponse from '../../helper/apiResponse';

export const addProfile =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;

        const {} = req.body;

        const sql = ``
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================
