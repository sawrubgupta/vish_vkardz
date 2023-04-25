import AWS from 'aws-sdk';
import configs from '../../config/development';
import multer from "multer";
import multerS3 from "multer-s3";
import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { authenticatingToken } from '../../middleware/authorization.controller';
import * as apiResponse from "../../helper/apiResponse";
let bucketName: any = process.env.BUCKET_NAME;

const credentials: any = configs.AWS;
var bucketImagePath: string = "";

let s3: any = new AWS.S3({
  credentials
});

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: bucketName, //'furball-images', 'furball-file'
      metadata: function (req, file, cb) {
  
        cb(null, { fieldName: file.fieldname });
      },
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: async (req: Request, file, cb) => {
        let type = req.body.type;
  
  
        if (type === "users") {
          cb(null, 'userImage/' + file.originalname)
        } else {
          cb(null, '/' + file.originalname)
        }
  
        // cb(null, 'vendorImage/'+file.originalname)
      }
    })
  })
  
  
  const uploadBucketRouter = Router();

uploadBucketRouter.post('/uploadImage', upload.single('file'), async (req: Request, res: Response) => {
  try {
    let type = req.body.type;
    const file:any = req.file
    console.log(type);

    if (!file) {
        return apiResponse.errorMessage(res, 400, "Please Upload a file");
    }
    return apiResponse.successResponse(res, "Uploded Successfully", file.location);

  } catch (error) {
      console.log(error);
      return apiResponse.errorMessage(res, 400, "Something Went Wrong"); 
  }
})

export default uploadBucketRouter;
