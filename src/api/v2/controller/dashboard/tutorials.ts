import { Request, Response } from "express";
import pool from '../../../../dbV2';
import * as apiResponse from "../../helper/apiResponse";
import config from '../../config/development';


export const tutorials = async (req: Request, res: Response) => {
    try {
        const sql = `SELECT * FROM tutorial_category WHERE status = 1`;
        const [rows]: any = await pool.query(sql);

        if (rows.length > 0) {
            const tutorialSql = `SELECT * FROM video_tutorials WHERE status = 1`;
            const [tutorialRows]:any = await pool.query(tutorialSql);

            if (tutorialRows.length === 0) return apiResponse.errorMessage(res, 400, "No data found");
            let categoryIndex = -1;
            for await (const ele of rows) {
                categoryIndex++;
                rows[categoryIndex].videos = []
                for (const tutorialsELe of tutorialRows) {
                    if (ele.id === tutorialsELe.category_id) {
                        (rows[categoryIndex].videos).push(tutorialsELe);
                    }
                }
            }

            return apiResponse.successResponse(res, "Data retrieved successfully", rows)
        } else {
            return apiResponse.errorMessage(res, 400, "No data found");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}
// ====================================================================================================
// ====================================================================================================
