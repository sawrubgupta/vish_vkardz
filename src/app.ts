import {Express} from 'express';
import express from 'express';
import apiRouter from "./api/api.index.routes";
import cors from 'cors';
import { rateLimiterUsingThirdParty } from './api/v1/middleware/rateLimiter';
import compression from "compression";
import morgan from 'morgan';
import helmet from 'helmet';
import fs from 'fs';

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
    app.use(express.static(__dirname+"./public_html"))
    app.use('/api', apiRouter);
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