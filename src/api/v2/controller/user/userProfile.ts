import {Request, Response, NextFunction} from "express";
import pool from "../../../../db";
import * as utility from "../../helper/utility";
import * as apiResponse from '../../helper/apiResponse';

export const addProfile =async (req:Request, res:Response) => {
    try {
        
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================
