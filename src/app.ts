import {Express} from 'express';
import express from 'express';
import apiRouter from "./api/api.index.routes";
import cors from 'cors';
import { rateLimiterUsingThirdParty } from './api/v1/middleware/rateLimiter';
import fs from 'fs'
import compression from "compression";
import morgan from 'morgan';
import helmet from 'helmet';
import multer from 'multer';
import {authenticatingToken} from './api/v1/middleware/authorization.controller';
import pool from "./db";

export default function (app: Express) {
    app.use(cors());
    app.use(express.json())
    app.use(compression())
    app.use(helmet());
    app.use(express.urlencoded({extended: false,limit: '1gb'}));
    app.set('view engine', 'hbs');
    app.use(morgan('dev'));
  
    app.use(morgan('common', {
        stream: fs.createWriteStream(__dirname+ '/access.log', {flags: 'a'})
    }));
    
    // app.use(express.static(__dirname+"./uploads"))
    app.use('/api',rateLimiterUsingThirdParty, apiRouter);
    
    var destinationPath : string = "";
    var dbImagePath : string = "";
    
    // SET STORAGE
/*
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            if(req.body.type === "profile"){
                destinationPath="../public_html/uploads/profile/thumb/";
                dbImagePath="uploads/profile/thumb/";
            } else if(req.body.type === "cover_photo"){
                destinationPath="../public_html/uploads/profile/cover/";
                dbImagePath="uploads/profile/cover/";
            } else if(req.body.type === "custom_logo"){
                destinationPath="../public_html/uploads/custom-logo/";
                dbImagePath="uploads/custom-logo/";
            }else{
                destinationPath="../public_html/uploads/";
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

//   app.post('/api/v1/vkardz/uploadFile', upload.single('file'),authenticatingToken, function (req, res) {
//     const file = req.file
//     const userId: string = res.locals.jwt.userId;

//   if (!file) {
//     return res.status(400).json({
//       status: false,
//       message: "Please upload a file.",
//     });
//   }
  
//   var sql : string ="";
//   if(req.body.type === "profile"){
//     sql = `UPDATE users SET thumb = '${dbImagePath}' WHERE id = ${userId}`;
//   } else if(req.body.type === "cover_photo"){
//     sql = `UPDATE users SET cover_photo = '${dbImagePath}' WHERE id = ${userId}`;
//   }
  

//   pool.query(sql, async (err: any, socialRow: any) => {
  
//     if (err) {
//       return res.status(400).json({
//         status: false,
//         message: "Something went wrong",
//       });
//     }

//     return res.status(200).json({
//       status: true,
//       message: "Image uploaded Successfully",
//     });
//   })
//  });
*/

   app.use('*', (req, res) => {
       res.status(404).json({
           message: 'Resource not available'
        });
    });
    
    app.use((err: any, req: any, res: any, next: any) => {
        if(err){ 
            res.status(500).json({
                status: false,
                message: "Something went wrong",
                error : err
            });
        }
        if (res.headersSent) {
            return next(err);
        }
        res.status(500).json({
            status: false,
            message: "Unexpected Error Occurred. Please contact our support team."
        });
    });
};