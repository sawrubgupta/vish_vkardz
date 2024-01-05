import { Request, Response } from "express";
import pool from '../../../../dbV2';
import * as apiResponse from '../../helper/apiResponse';
import config from '../../config/development';
import resMsg from '../../config/responseMsg';

const searchUserResMsg = resMsg.profile.searchUser;

export const search =async (req:Request, res: Response) => {
    try {
        const latitude = req.query.latitude;
        const longitude = req.query.longitude;

        let keyword = req.query.keyword;

        var getPage: any = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page) page = 1;
        var page_size: any = config.pageSize;
        const offset = (page - 1) * page_size;


        // const getPageQuery = `SELECT COUNT(users_profile.id) AS length, ( 3959 * acos( cos( radians('${latitude}') ) * cos( radians( users_latlong.latitude ) ) * cos( radians( users_latlong.longitude ) - radians('${longitude}') ) + sin( radians('${latitude}') ) * sin( radians( users_latlong.latitude ) ) ) ) AS distance FROM vcf_info LEFT JOIN users ON users.id = vcf_info.user_id LEFT JOIN users_latlong ON users_latlong.profile_id = vcf_info.profile_id LEFT JOIN users_profile ON users_profile.id = vcf_info.profile_id WHERE users.deleted_at IS NULL AND vcf_info.type = '${config.vcfDesignation}' AND (users.username LIKE '%${keyword}%' OR vcf_info.value LIKE '%${keyword}%') GROUP BY distance HAVING distance < ${config.latlongDistance}`;
        // const [result]: any = await pool.query(getPageQuery);

        // const sql = `SELECT users.username, users_profile.profile_image, users_profile.on_tap_url, vcf_info.user_id, vcf_info.profile_id, vcf_info.value AS designation, ( 3959 * acos( cos( radians('${latitude}') ) * cos( radians( users_latlong.latitude ) ) * cos( radians( users_latlong.longitude ) - radians('${longitude}') ) + sin( radians('${latitude}') ) * sin( radians( users_latlong.latitude ) ) ) ) AS distance FROM vcf_info LEFT JOIN users ON users.id = vcf_info.user_id LEFT JOIN users_latlong ON users_latlong.profile_id = vcf_info.profile_id LEFT JOIN users_profile ON users_profile.id = vcf_info.profile_id WHERE users.deleted_at IS NULL AND vcf_info.type = '${config.vcfDesignation}' AND (users.username LIKE '%${keyword}%' OR vcf_info.value LIKE '%${keyword}%') GROUP BY distance HAVING distance < ${config.latlongDistance} ORDER BY distance limit ${page_size} offset ${offset}`;

        const getPageQuery = `SELECT COUNT(users_profile.id) AS length FROM vcf_info LEFT JOIN users ON users.id = vcf_info.user_id LEFT JOIN users_profile ON users_profile.id = vcf_info.profile_id WHERE users.deleted_at IS NULL AND vcf_info.type = '${config.vcfDesignation}' AND (users.username LIKE '%${keyword}%' OR vcf_info.value LIKE '%${keyword}%')`;
        const [result]: any = await pool.query(getPageQuery);

        const sql = `SELECT users.username, users_profile.profile_image, users_profile.on_tap_url, vcf_info.user_id, vcf_info.profile_id, vcf_info.value AS designation FROM vcf_info LEFT JOIN users ON users.id = vcf_info.user_id LEFT JOIN users_profile ON users_profile.id = vcf_info.profile_id WHERE users.deleted_at IS NULL AND vcf_info.type = '${config.vcfDesignation}' AND (users.username LIKE '%${keyword}%' OR vcf_info.value LIKE '%${keyword}%') limit ${page_size} offset ${offset}`;

        // const sql1 = `SELECT id, username, name, thumb, phone, email FROM users WHERE name LIKE '%${keyword}%' OR address LIKE '%${keyword}%' OR designation LIKE '%${keyword}%' ORDER BY users.post_time desc limit ${page_size} offset ${offset}`;
        const [rows]:any = await pool.query(sql);

        const defaultArr = [
            {
                username: "vkardz",
                profile_image: "",
                designation: "vKardz", 
                on_tap_url: "https://vkardz.com/vkardznew"
            },
            {
                username: "myvkardz",
                profile_image: "",
                designation: "manager", 
                on_tap_url: "https://vkardz.com/myvkardz"
            },
            {
                username: "vkardz",
                profile_image: "",
                designation: "vKardz", 
                on_tap_url: "https://vkardz.com/vkardznew"
            }
        ]

        const dataArr = {rows, defaultArr}
        // let totalLength:number = result[0]?.length ?? 0;
        let totalLength:number = result.length
        let totalPages: any = totalLength / page_size;
        let totalPage = Math.ceil(totalPages);

        if (rows.length > 0) {
            return apiResponse.successResponseWithPagination(res, searchUserResMsg.search.successMsg, dataArr, totalPage, page, totalLength);
        } else {
            return apiResponse.successResponseWithPagination(res, searchUserResMsg.search.noDataFoundMsg, dataArr, totalPage, page, totalLength);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================
