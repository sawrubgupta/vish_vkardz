import AWS from 'aws-sdk';
import configs from '../../config/development';
import multer from "multer";
import multerS3 from "multer-s3";
import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { authenticatingToken,tempAuthenticatingToken } from '../../middleware/authorization.controller';
import * as apiResponse from "../../helper/apiResponse";
import * as utility from '../../helper/utility';
import pool from '../../../../dbV2';

let bucketName: any = process.env.BUCKET_NAME;

const credentials: any = configs.AWS;
var bucketImagePath: string = "";

let s3: any = new AWS.S3({
    credentials
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: bucketName, 
        metadata: function (req, file, cb) {

            cb(null, { fieldName: file.fieldname });
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: async (req: Request, file, cb) => {
            let type = req.body.type;
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

            if (type === "blogs") {
                cb(null, 'uploads/blogs/' + uniqueSuffix + '_' + file.originalname)
            } else if (type === "company") {
                cb(null, 'uploads/company_logo/' + uniqueSuffix + '_' + file.originalname)
            } else if (type === "about") {
                cb(null, 'uploads/about/' + uniqueSuffix + '_' + file.originalname)
            } else if (type === "custom") {
                cb(null, 'uploads/custom-logo/' + uniqueSuffix + '_' + file.originalname)
            } else if (type === "customize_file") {
                cb(null, 'uploads/customize_file/' + uniqueSuffix + '_' + file.originalname)
            } else if (type === "files") {
                cb(null, 'uploads/files/' + uniqueSuffix + '_' + file.originalname)
            } else if (type === "portfolio") {
                cb(null, 'uploads/portfolio/' + uniqueSuffix + '_' + file.originalname)
            } else if (type === "profile") {
                cb(null, 'uploads/profile/' + uniqueSuffix + '_' + file.originalname)
            } else if (type === "qrcode") {
                cb(null, 'uploads/qrcode/' + uniqueSuffix + '_' + file.originalname)
            } else if (type === "rating") {
                cb(null, 'uploads/rating/' + uniqueSuffix + '_' + file.originalname)
            } else if (type === "reviews") {
                cb(null, 'uploads/reviews/' + uniqueSuffix + '_' + file.originalname)
            } else if (type === "services") {
                cb(null, 'uploads/services/' + uniqueSuffix + '_' + file.originalname)
            } else if (type === "cover") {
                cb(null, 'uploads/cover/' + uniqueSuffix + '_' + file.originalname)
            } else if (type === "docfile") {
                cb(null, 'uploads/user_docfile/' + uniqueSuffix + '_' + file.originalname)
            } else if (type === "vcard") {
                cb(null, 'uploads/vcard/' + uniqueSuffix + '_' + file.originalname)
            } else if (type === "video") {
                cb(null, 'uploads/video/' + uniqueSuffix + '_' + file.originalname)
            } else if (type === "social") {
                cb(null, 'uploads/social_icon/updated/' + uniqueSuffix + '_' + file.originalname)
            } else if (type === "features") {
                cb(null, 'uploads/app-icon/features/' + uniqueSuffix + '_' + file.originalname)
            }else if (type === "thumb") {
                cb(null, 'uploads/users/thumb/' + uniqueSuffix + '_' + file.originalname)
            } else {
                cb(null, 'uploads/others' + uniqueSuffix + '_' + file.originalname)
            } 

            // cb(null, 'vendorImage/'+file.originalname)
        }
    })
})


const uploadBucketRouter = Router();

uploadBucketRouter.post('/uploadFile', tempAuthenticatingToken, upload.single('file'), async (req: Request, res: Response) => {
    try {
        const userId = res.locals.jwt.userId;
        let type = req.body.type;
        const file: any = req.file
        const createdAt = utility.dateWithFormat();
        console.log(type);

        if (!file) return apiResponse.errorMessage(res, 400, "Please Upload a file");

        const filePath = (file.location).split("https://vkardz.s3.ap-south-1.amazonaws.com/");

        const sql = `INSERT INTO all_files(user_id, type, url, created_at) VALUES(?, ?, ?, ?)`;
        const VALUES = [userId, type, filePath[1], createdAt];
        const [rows]: any = await pool.query(sql, VALUES);
        
        return apiResponse.successResponse(res, "Uploded Successfully", filePath[1]);

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
})

export default uploadBucketRouter;
