import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import config from '../../config/development';

export const getLayout =async (req:Request, res:Response) => {
    try {
        const sql = `SELECT * FROM layout_types`;
        let [layoutTypeData]:any = await pool.query(sql);        

        const sql1 = `SELECT * FROM vkard_layouts`;
        const [data]:any = await pool.query(sql1);   

        let rowIndex =-1
        for(const element of layoutTypeData){
            rowIndex++;
            layoutTypeData[rowIndex].layout = []

            let dataIndex = -1;
            for(const e of data){
                dataIndex++;
                if(element.id === e.type_id){
                    (layoutTypeData[rowIndex].layout).push(e);
                }
            }
        }
        return apiResponse.successResponse(res, "Layouts get Succesfully", layoutTypeData);
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}
// ====================================================================================================
// ====================================================================================================

export const updateVcardLayout =async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        if (type && type === config.businessType) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !")
        }

        const profileColor = req.body.profileColor;
        let styleId = req.body.styleId;
        // if (!styleId || styleId === "") {
        //     styleId = 1;
        // }
        const sql = `UPDATE users SET vcard_layouts = ?, vcard_bg_color = ? WHERE id = ?`;
        const VALUES = [styleId, profileColor, userId];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Vcard layout updated successfully !", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to update layout, try again");
        }

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
