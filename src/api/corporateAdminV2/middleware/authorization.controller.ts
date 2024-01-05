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

// this is use for dashboard page and products page api because user can access both with login and without login
export function tempAuthenticatingToken(req:Request, res : Response, next :NextFunction){

    const authHeaders = req.headers['authorization'];
    const token:any =  authHeaders?.split(" ")[1];

    // if(token === null || token === undefined){
    //     return res.status(401).json({
    //         status: false,
    //         data: null,
    //         message: "Unauthorized access!",
    //       });
    // }
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

// ====================================================================================================
// ====================================================================================================
