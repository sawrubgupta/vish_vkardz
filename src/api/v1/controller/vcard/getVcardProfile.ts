import {Request, Response} from "express";
import * as apiRespone from '../../helper/apiResponse';
import pool from '../../../../db';

export const getVcardProfile =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        if (!userId || userId === "" || userId === undefined) {
            return apiRespone.errorMessage(res, 404, "User profile not found !");
        }
    } catch (error) {
        console.log(error);
        return apiRespone.errorMessage(res, 400, "Something went wrong");
    }
}