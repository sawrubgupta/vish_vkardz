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
        jobTitle: Joi.string().allow('').allow(null),
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

export const ChangeAdminPasswordValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        oldPassword: Joi.string().max(80).required(),
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


export const ChangeUserPasswordValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        // oldPassword: Joi.string().max(80).required(),
        type: Joi.string().allow('').allow(null),
        userId: Joi.number().allow('').allow(null),
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


export const updateUserDetailValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        type: Joi.string().allow('').allow(null),
        userId: Joi.number().allow('').allow(null),
        username: Joi.string().trim().required(),
        email: Joi.string().trim().email().required(),
        phone: Joi.string().required(),
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


export const updateAdminDetailValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().required(), 
        email: Joi.string().email().required(), 
        phone: Joi.string().required(), 
        image: Joi.string().allow('').allow(null), 
        company: Joi.string().allow('').allow(null), 
        designation: Joi.string().allow('').allow(null), 
        cin_number: Joi.string().allow('').allow(null), 
        gst_number: Joi.string().allow('').allow(null)  
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

