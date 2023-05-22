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
exports.adminProfile = exports.updateAdmin = exports.updateUserDisplayField = exports.updateUser = exports.userDetail = exports.userList = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const development_1 = __importDefault(require("../../config/development"));
const userList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const keyword = req.query.keyword;
        var getPage = req.query.page;
        var page = parseInt(getPage);
        if (page === null || page <= 1 || !page) {
            page = 1;
        }
        var page_size = development_1.default.pageSize;
        const offset = (page - 1) * page_size;
        const getPageQuery = `SELECT id FROM users WHERE admin_id = ${userId}`;
        const [result] = yield db_1.default.query(getPageQuery);
        const sql = `SELECT id, username, name, email, phone, dial_code, card_number, card_number_fix, is_card_linked, is_deactived, designation, website, account_type, thumb, cover_photo, primary_profile_link, display_dial_code, display_email, display_number FROM users WHERE admin_id = ${userId} AND (username LIKE '%${keyword}%' OR name LIKE '%${keyword}%') ORDER BY username asc limit ${page_size} offset ${offset}`;
        const [rows] = yield db_1.default.query(sql);
        const adminSql = `SELECT * FROM business_admin WHERE id = ${userId} LIMIT 1`;
        const [adminRows] = yield db_1.default.query(adminSql);
        let totalPages = result.length / page_size;
        let totalPage = Math.ceil(totalPages);
        if (rows.length > 0) {
            return res.status(200).json({
                status: true,
                data: rows,
                adminData: adminRows,
                totalPage: totalPage,
                currentPage: page,
                totalLength: result.length,
                message: "Users list are here"
            });
        }
        else {
            return res.status(200).json({
                status: true,
                data: rows,
                adminData: adminRows,
                totalPage: totalPage,
                currentPage: page,
                totalLength: result.length,
                message: "Data Not Found"
            });
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.userList = userList;
// ====================================================================================================
// ====================================================================================================
const userDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const sql = `SELECT id, username, name, email, phone, designation, website, thumb, cover_photo, company_name, address, primary_profile_link, website,  FROM users WHERE admin_id = ${userId} `;
        const [rows] = yield db_1.default.query(sql);
        return apiResponse.successResponse(res, "Data retrieved Successfully", null);
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.userDetail = userDetail;
// ====================================================================================================
// ====================================================================================================
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId;
        const type = req.body.type; //type = business, user, null
        if (type && type === development_1.default.businessType) {
            userId = req.body.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "User Id is required!");
        }
        const { username, email, phone, dialCode } = req.body;
        const emailSql = `SELECT username, email, phone FROM users where deleted_at IS NULL AND id != ? AND (email = ? or username = ? or phone = ?) LIMIT 1`;
        const emailValues = [userId, email, username, phone];
        const [data] = yield db_1.default.query(emailSql, emailValues);
        const dupli = [];
        if (data.length > 0) {
            if (data[0].email === email) {
                dupli.push("email");
            }
            if (data[0].username === username) {
                dupli.push("username");
            }
            if (data[0].phone === phone) {
                dupli.push("phone");
            }
            console.log(dupli);
            const msg = `${dupli.join()} is duplicate, Please change it`;
            return res.status(400).json({
                status: false,
                data: null,
                message: msg,
            });
        }
        const checkUserSql = `SELECT name FROM users WHERE id = ${userId} LIMIT 1`;
        const [userData] = yield db_1.default.query(checkUserSql);
        if (userData.length > 0) {
            const updateSql = `UPDATE users SET username = ?, email = ?, phone = ?, dial_code = ? WHERE id = ?`;
            const VALUES = [username, email, phone, dialCode, userId];
            const [rows] = yield db_1.default.query(updateSql, VALUES);
            if (rows.affectedRows > 0) {
                return apiResponse.successResponse(res, "Updated Successfully", null);
            }
            else {
                return apiResponse.errorMessage(res, 400, "Failed to update, try again");
            }
        }
        else {
            return apiResponse.errorMessage(res, 400, "User not found!");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.updateUser = updateUser;
// ====================================================================================================
// ====================================================================================================
const updateUserDisplayField = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId: string = res.locals.jwt.userId;
        let userId;
        const type = req.query.type; //type = business, user, null
        if (type && type === development_1.default.businessType) {
            userId = req.query.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !");
        }
        const { name, designation, companyName, dialCode, phone, email, website, address } = req.body;
        const updateQuery = `UPDATE users SET full_name = ?, designation = ?, company_name = ?, display_dial_code = ?, display_number = ?, display_email = ?, website = ?, address = ? WHERE id = ?`;
        const VALUES = [name, designation, companyName, dialCode, phone, email, website, address, userId];
        const [data] = yield db_1.default.query(updateQuery, VALUES);
        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Profile updated successfully !", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to update the user, please try again later !");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.updateUserDisplayField = updateUserDisplayField;
// ====================================================================================================
// ====================================================================================================
const updateAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = res.locals.jwt.userId;
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "User Id is required!");
        }
        const { name, email, phone, dialCode, image, company, designation, cin_number, gst_number } = req.body;
        const emailSql = `SELECT email, phone FROM business_admin WHERE deleted_at IS NULL AND id != ? AND (email = ? or phone = ?) LIMIT 1`;
        const emailValues = [userId, email, phone];
        const [data] = yield db_1.default.query(emailSql, emailValues);
        const dupli = [];
        if (data.length > 0) {
            if (data[0].email === email) {
                dupli.push("email");
            }
            if (data[0].phone === phone) {
                dupli.push("phone");
            }
            console.log(dupli);
            const msg = `${dupli.join()} is duplicate, Please change it`;
            return res.status(400).json({
                status: false,
                data: null,
                message: msg,
            });
        }
        const checkUserSql = `SELECT name FROM business_admin WHERE id = ${userId} LIMIT 1`;
        const [userData] = yield db_1.default.query(checkUserSql);
        if (userData.length > 0) {
            const updateSql = `UPDATE business_admin SET name = ?, email = ?, phone = ?, dial_code = ?, image = ?, company = ?, designation = ?, cin_number = ?, gst_number = ? WHERE id = ?`;
            const VALUES = [name, email, phone, dialCode, image, company, designation, cin_number, gst_number, userId];
            const [rows] = yield db_1.default.query(updateSql, VALUES);
            if (rows.affectedRows > 0) {
                return apiResponse.successResponse(res, "Updated Successfully", null);
            }
            else {
                return apiResponse.errorMessage(res, 400, "Failed to update, try again");
            }
        }
        else {
            return apiResponse.errorMessage(res, 400, "User not found!");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.updateAdmin = updateAdmin;
// ====================================================================================================
// ====================================================================================================
const adminProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const adminSql = `SELECT * FROM business_admin WHERE id = ${userId} LIMIT 1`;
        const [adminRows] = yield db_1.default.query(adminSql);
        return apiResponse.successResponse(res, "Data retrieved Successfully", adminRows[0]);
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.adminProfile = adminProfile;
// ====================================================================================================
// ====================================================================================================
