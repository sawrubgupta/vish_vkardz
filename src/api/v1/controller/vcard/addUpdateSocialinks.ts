import {Request, Response, NextFunction} from "express";
import * as apiResponse from '../../helper/apiResponse';
import pool from '../../../../db';
import { dateWithFormat } from "../../helper/utility";

async function addUpdateSocialLinks (querySocialSite : String ,res:Response )  {
    try {
        return new Promise( (resolve, reject) => {
            pool.query(` ${querySocialSite}`, (error:any, elements:any) => {
                if (error) {
                    return reject(error); 
                }
                return resolve (elements.affectedRows);
            });
        }); 
    } catch (error) {
        return await apiResponse.errorMessage(res, 400, "Something went wrong");
    }
} 

export const updateSocialLinks = async (req:Request, res:Response) => {
    try {
        const user_id: string = res.locals.jwt.userId;
        for await (const socialSiteItem of req.body.social_sites) {
            const site_id =  socialSiteItem.site_id;
            const site_value =  socialSiteItem.site_value;
            const orders =  socialSiteItem.orders;
            const site_label =  socialSiteItem.site_label;

            const sql = `SELECT * From vcard_social_sites WHERE user_id = ${user_id} AND site_id = ${site_id}`;
            const [socialRows]:any = await pool.query(sql)
        }
    } catch (error) {
        console.log(error);
        return 
    }
}