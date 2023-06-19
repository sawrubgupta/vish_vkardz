import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from "../../helper/apiResponse";

export const mixingData = async (req: Request, res: Response) => {
    try {
        const geturls = `SELECT slug, url FROM app_setting WHERE status = 1`;
        const [url]: any = await pool.query(geturls);

        const appVersionQuery = `SELECT * FROM app_update LIMIT 1`;
        const [appVersionData]: any = await pool.query(appVersionQuery);

        const appVersionRows: object = {
            android: {
                forceUpdate: appVersionData.force_android_update,
                packageName: appVersionData.description,
                launchUrl: appVersionData.android_url,
                versionName: appVersionData.android_version,
                versionCode: appVersionData.android_code,
            },
            ios: {
                forceUpdate: appVersionData.force_ios_update,
                packageName: appVersionData.description,
                launchUrl: appVersionData.ios_url,
                versionName: appVersionData.ios_version,
                versionCode: appVersionData.ios_code,
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
