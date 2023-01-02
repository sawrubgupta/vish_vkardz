import { Request, Response } from "express";


export const successResponse = async  (res:Response, msg:String , data:any) => {
	var resData = {
		status: true,
		data: data,
		message: msg,
	};
	return res.status(200).json(resData);
}

// ====================================================================================================
// ====================================================================================================

export const validationErrorWithData = async (res:Response, msg:String, data:any) => {
	var resData = {
		status: false,
		message: msg,
		data: data
	};
	return res.status(400).json(resData);
}

// ====================================================================================================
// ====================================================================================================
	
export const errorMessage = async (res:Response, statusCode:number ,msg:string) => {
	return res.status(statusCode).json({
		status:false,
		data:null,
		message:msg
	})
}

// ====================================================================================================
// ====================================================================================================
