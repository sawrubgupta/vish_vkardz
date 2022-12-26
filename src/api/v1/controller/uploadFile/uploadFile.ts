import { Request, Response, Router } from "express";
import multer from 'multer';
import {authenticatingToken} from '../../middleware/authorization.controller';
import * as apiResponse from "../../helper/apiResponse";

var destinationPath : string = "";
var dbImagePath : string = "";

export var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let type = req.body.type;

        if(type === "profile"){
            destinationPath="./public_html/uploads/profile/thumb/";
            dbImagePath="uploads/profile/thumb/";
        } else if(type === "cover_photo"){
            destinationPath="./public_html/uploads/profile/cover/";
            dbImagePath="uploads/profile/cover/";
        } else if(type === "custom_logo"){
            destinationPath="./public_html/uploads/custom-logo/";
            dbImagePath="uploads/custom-logo/";
        } else if(type === "aboutus_image"){
            destinationPath="./public_html/uploads/services/aboutus/";
            dbImagePath="uploads/services/aboutus/";
        } else if (type === "product_image") {
            destinationPath="./public_html/uploads/services/product/";
            dbImagePath="uploads/services/product/";
        } else if (type === "portfolio") {
            destinationPath="./public_html/uploads/services/portfolio/";
            dbImagePath="uploads/services/portfolio/";
        } else if (type === "customize_file") {
            destinationPath="./public_html/uploads/customize_file/";
            dbImagePath="uploads/customize_file/";
        } else{
            destinationPath="./public_html/uploads/";
            dbImagePath="uploads/";
        }
        cb(null, destinationPath)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        dbImagePath = dbImagePath+''+uniqueSuffix+'_' +  file.originalname;
        cb(null,uniqueSuffix+'_' +  file.originalname)
    }
})
var upload = multer({ storage: storage })

const uploadRouter = Router();

uploadRouter.post('/uploadFile', authenticatingToken, upload.single('file'),async (req:Request, res:Response) => {
    try {
        const file: any = req.file;
        let type = req.body.type;
        if (!file) {
            return apiResponse.errorMessage(res, 400, "Please Upload a file");
        }
        return apiResponse.successResponse(res, "Image uploded Successfully", dbImagePath);
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
})

export default uploadRouter;

// ====================================================================================================
// ====================================================================================================
