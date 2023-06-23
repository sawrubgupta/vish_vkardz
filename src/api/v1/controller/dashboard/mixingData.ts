import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from "../../helper/apiResponse";

export const mixingData = async (req: Request, res: Response) => {
    try {
        const geturls = `SELECT * FROM app_setting WHERE status = 1`;
        const [url]: any = await pool.query(geturls);

        const appVersionQuery = `SELECT * FROM app_update LIMIT 1`;
        const [appVersionData]: any = await pool.query(appVersionQuery);

        const appVersionRows: object = {
            android: {
                forceUpdate: appVersionData[0].force_android_update,
                packageName: appVersionData[0].description,
                launchUrl: appVersionData[0].android_url,
                versionName: appVersionData[0].android_version,
                versionCode: appVersionData[0].android_code,
                isRequired: appVersionData[0].is_required,
            },
            ios: {
                forceUpdate: appVersionData[0].force_ios_update,
                packageName: appVersionData[0].description,
                launchUrl: appVersionData[0].ios_url,
                versionName: appVersionData[0].ios_version,
                versionCode: appVersionData[0].ios_code,
                isRequired: appVersionData[0].is_required,
            }
        }


        // return apiResponse.successResponse(res, "Data Retrieved Successfully", data);\
        return res.status(200).json({
            status: true,
            url, appVersionRows,
            message: "Data Retrieved Successfully"
        })

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
