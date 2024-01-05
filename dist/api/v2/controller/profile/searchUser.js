"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const development_1 = __importDefault(require("../../config/development"));
const responseMsg_1 = __importDefault(require("../../config/responseMsg"));
const searchUserResMsg = responseMsg_1.default.profile.searchUser;
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const latitude = req.query.latitude;
        const longitude = req.query.longitude;
        let keyword = req.query.keyword;
        var getPage = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page)
            page = 1;
        var page_size = development_1.default.pageSize;
        const offset = (page - 1) * page_size;
        // const getPageQuery = `SELECT COUNT(users_profile.id) AS length, ( 3959 * acos( cos( radians('${latitude}') ) * cos( radians( users_latlong.latitude ) ) * cos( radians( users_latlong.longitude ) - radians('${longitude}') ) + sin( radians('${latitude}') ) * sin( radians( users_latlong.latitude ) ) ) ) AS distance FROM vcf_info LEFT JOIN users ON users.id = vcf_info.user_id LEFT JOIN users_latlong ON users_latlong.profile_id = vcf_info.profile_id LEFT JOIN users_profile ON users_profile.id = vcf_info.profile_id WHERE users.deleted_at IS NULL AND vcf_info.type = '${config.vcfDesignation}' AND (users.username LIKE '%${keyword}%' OR vcf_info.value LIKE '%${keyword}%') GROUP BY distance HAVING distance < ${config.latlongDistance}`;
        // const [result]: any = await pool.query(getPageQuery);
        // const sql = `SELECT users.username, users_profile.profile_image, users_profile.on_tap_url, vcf_info.user_id, vcf_info.profile_id, vcf_info.value AS designation, ( 3959 * acos( cos( radians('${latitude}') ) * cos( radians( users_latlong.latitude ) ) * cos( radians( users_latlong.longitude ) - radians('${longitude}') ) + sin( radians('${latitude}') ) * sin( radians( users_latlong.latitude ) ) ) ) AS distance FROM vcf_info LEFT JOIN users ON users.id = vcf_info.user_id LEFT JOIN users_latlong ON users_latlong.profile_id = vcf_info.profile_id LEFT JOIN users_profile ON users_profile.id = vcf_info.profile_id WHERE users.deleted_at IS NULL AND vcf_info.type = '${config.vcfDesignation}' AND (users.username LIKE '%${keyword}%' OR vcf_info.value LIKE '%${keyword}%') GROUP BY distance HAVING distance < ${config.latlongDistance} ORDER BY distance limit ${page_size} offset ${offset}`;
        const getPageQuery = `SELECT COUNT(users_profile.id) AS length FROM vcf_info LEFT JOIN users ON users.id = vcf_info.user_id LEFT JOIN users_profile ON users_profile.id = vcf_info.profile_id WHERE users.deleted_at IS NULL AND vcf_info.type = '${development_1.default.vcfDesignation}' AND (users.username LIKE '%${keyword}%' OR vcf_info.value LIKE '%${keyword}%')`;
        const [result] = yield dbV2_1.default.query(getPageQuery);
        const sql = `SELECT users.username, users_profile.profile_image, users_profile.on_tap_url, vcf_info.user_id, vcf_info.profile_id, vcf_info.value AS designation FROM vcf_info LEFT JOIN users ON users.id = vcf_info.user_id LEFT JOIN users_profile ON users_profile.id = vcf_info.profile_id WHERE users.deleted_at IS NULL AND vcf_info.type = '${development_1.default.vcfDesignation}' AND (users.username LIKE '%${keyword}%' OR vcf_info.value LIKE '%${keyword}%') limit ${page_size} offset ${offset}`;
        // const sql1 = `SELECT id, username, name, thumb, phone, email FROM users WHERE name LIKE '%${keyword}%' OR address LIKE '%${keyword}%' OR designation LIKE '%${keyword}%' ORDER BY users.post_time desc limit ${page_size} offset ${offset}`;
        const [rows] = yield dbV2_1.default.query(sql);
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
        ];
        const dataArr = { rows, defaultArr };
        // let totalLength:number = result[0]?.length ?? 0;
        let totalLength = result.length;
        let totalPages = totalLength / page_size;
        let totalPage = Math.ceil(totalPages);
        if (rows.length > 0) {
            return apiResponse.successResponseWithPagination(res, searchUserResMsg.search.successMsg, dataArr, totalPage, page, totalLength);
        }
        else {
            return apiResponse.successResponseWithPagination(res, searchUserResMsg.search.noDataFoundMsg, dataArr, totalPage, page, totalLength);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.search = search;
// ====================================================================================================
// ====================================================================================================
