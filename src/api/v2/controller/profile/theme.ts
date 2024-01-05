import { Request, Response } from "express";
import pool from '../../../../dbV2';
import * as apiResponse from '../../helper/apiResponse';
import config from '../../config/development';
import resMsg from '../../config/responseMsg';

const themeResMsg = resMsg.profile.theme;

export const getLayout =async (req:Request, res:Response) => {
    try {
        const sql = `SELECT * FROM layout_types`;
        let [layoutTypeData]:any = await pool.query(sql);        

        const sql1 = `SELECT * FROM vkard_layouts WHERE status = 1`;
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
        return apiResponse.successResponse(res, themeResMsg.getLayout.successMsg, layoutTypeData);
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}
// ====================================================================================================
// ====================================================================================================

export const updateVcardLayout =async (req:Request, res:Response) => {
    try {
        // const userId:string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.body.type; //type = business, user, null
        const profileId = req.body.profileId;
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, themeResMsg.updateVcardLayout.nullUserId);

        const { profileColor, styleId } = req.body;
        // if (!styleId || styleId === "") {
        //     styleId = 1;
        // }
        const sql = `UPDATE users_profile SET vcard_layouts = ?, vcard_bg_color = ? WHERE user_id = ? AND id = ?`;
        const VALUES = [styleId, profileColor, userId, profileId];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, themeResMsg.updateVcardLayout.successMsg, null);
        } else {
            return apiResponse.errorMessage(res, 400, themeResMsg.updateVcardLayout.failedMsg);
        }

    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================
