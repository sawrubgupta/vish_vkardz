import {Request, Response, NextFunction} from "express";
import 'dotenv/config';
import jwt from "jsonwebtoken";
import config from "../config/development";

const secretKey:any = config.secretKey; //process.env.SECRET;

export function authenticatingToken(req:Request, res : Response, next :NextFunction){

    const authHeaders = req.headers['authorization'];
    const token =  authHeaders?.split(" ")[1];

    if(token === null || token === undefined){
        return res.status(401).json({
            status: false,
            data: null,
            message: "Unauthorized access!",
          });
    }
    
    jwt.verify(token, secretKey, async (err:any, user:any) => {
        if(err){
            return res.status(401).json({
                status: false,
                data: null,
                message: "Unauthorized access!",
              });
        }
        res.locals.jwt = user;
        next();
    })
}

// ====================================================================================================
// ====================================================================================================


export function tempAuthenticatingToken(req:Request, res : Response, next :NextFunction){

    const authHeaders = req.headers['authorization'];
    const type = req.body.type;
    const token:any =  authHeaders?.split(" ")[1];

    // if(token === null || token === undefined){
    //     return res.status(401).json({
    //         status: false,
    //         data: null,
    //         message: "Unauthorized access!",
    //       });
    // }
    if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
        res.locals.jwt = "";
        next();
    } else {
        if (token) {
            jwt.verify(token, secretKey, async (err:any, user:any) => {
                if(err){
                    console.log(err);
                    
                    return res.status(401).json({
                        status: false,
                        data: null,
                        message: "Unauthorized access!",
                      });
                }
                res.locals.jwt = user;
                next();
            })
        } else {
            res.locals.jwt = "";
            next();
        }
    }
}

// ====================================================================================================
// ====================================================================================================
