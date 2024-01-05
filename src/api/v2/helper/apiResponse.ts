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

export const somethingWentWrongMessage = async (res:Response) => {
	return res.status(400).json({
		status:false,
		data:null,
		message:"Something went wrong"
	})
}

// ====================================================================================================
// ====================================================================================================

export const successResponseWithPagination = async  (res:Response, msg:String , data:any, totalPage:any, currentPage:any, totalLength:any) => {
	var resData = {
		status: true,
		data: data,
		totalPage: totalPage,
		currentPage: currentPage,
		totalLength: totalLength,
		message: msg,
	};
	return res.status(200).json(resData);
}

// ====================================================================================================
// ====================================================================================================
