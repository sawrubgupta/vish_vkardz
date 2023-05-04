import { NextFunction, Request, Response } from "express";
import * as apiResponse from '../helper/apiResponse'
import Joi from "joi";

async function validationCheck(value: any) {
    let msg = value.error.details[0].message;
    console.log(msg);
    
    msg = msg.replace(/"/g, "");
    msg = msg.replace('_', " ");
    msg = msg.replace('.', " ");
    
    const errorMessage = "Validation error : " + msg;
    return errorMessage;
}

export const adminRegistrationValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().max(70).required(),       
        email: Joi.string().email().max(80).required(),
        password: Joi.string().min(3).max(80).required(),
        phone: Joi.string().trim().min(8).max(20).trim().required(),
        image : Joi.string().trim().allow(''),
        jobTitle: Joi.string().required(),
        company:Joi.string().trim().required(),
    });

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res,400, errMsg);
    }
    next();
};

// ====================================================================================================
// ====================================================================================================

export const adminLoginValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        email: Joi.string().email().max(80).required(),
        password: Joi.string().min(3).max(30).required(),
    });

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res,400, errMsg);
    }
    next();
};

// ====================================================================================================
// ====================================================================================================

export const adminChangePasswordValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        // oldPassword: Joi.string().max(80).required(),
        newPassword: Joi.string().min(3).max(80).required(),
    });

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res,400, errMsg);
    }
    next();
};

// ====================================================================================================
// ====================================================================================================

