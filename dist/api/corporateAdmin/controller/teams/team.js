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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamMemberDetail = exports.deleteTeamMember = exports.teamMemberList = exports.updateTeamMember = exports.addTeamMember = exports.getPermissionList = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const development_1 = __importDefault(require("../../config/development"));
const md5_1 = __importDefault(require("md5"));
const getPermissionList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = `SELECT * FROM team_permissions WHERE status = 1`;
        const [rows] = yield db_1.default.query(sql);
        return apiResponse.successResponse(res, "Permission List are here", rows);
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something wnt wrong");
    }
});
exports.getPermissionList = getPermissionList;
// ====================================================================================================
// ====================================================================================================
const addTeamMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c, _d, e_2, _e, _f;
    // const client = await pool.getConnection();
    try {
        const userId = res.locals.jwt.userId;
        const { name, email, password, image } = req.body;
        const permissions = req.body.permissions;
        const createdAt = utility.dateWithFormat();
        const hash = (0, md5_1.default)(password);
        let arr = [];
        for (const ele of permissions) {
            let permissionId = ele.permissionId;
            arr.push(permissionId);
        }
        const checkPermissionsql = `SELECT * FROM team_permissions WHERE status = 1 AND id NOT IN(${arr})`;
        const [permissionRows] = yield db_1.default.query(checkPermissionsql);
        try {
            for (var _g = true, permissionRows_1 = __asyncValues(permissionRows), permissionRows_1_1; permissionRows_1_1 = yield permissionRows_1.next(), _a = permissionRows_1_1.done, !_a;) {
                _c = permissionRows_1_1.value;
                _g = false;
                try {
                    const iterator = _c;
                    permissions.push({
                        permissionId: iterator.id,
                        action: "none"
                    });
                }
                finally {
                    _g = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_g && !_a && (_b = permissionRows_1.return)) yield _b.call(permissionRows_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const checkDupliSql = `SELECT * FROM business_admin WHERE deleted_at IS NULL AND email = ? LIMIT 1`;
        const dupliVALUES = [email];
        const [dupliRows] = yield db_1.default.query(checkDupliSql, dupliVALUES);
        const dupli = [];
        if (dupliRows.length > 0) {
            if (dupliRows[0].email === email) {
                dupli.push("email");
            }
            else {
                dupli.push("email");
            }
            console.log(dupli);
            const msg = `${dupli.join()} is duplicate, Please change it`;
            return res.status(400).json({
                status: false,
                data: null,
                message: msg,
            });
        }
        // await client.query("START TRANSACTION");
        const sql = `INSERT INTO business_admin(type, admin_id, name, email, password, image, created_at) VALUES(?, ?, ?, ?, ?, ?, ?)`;
        const VALUES = [development_1.default.memberType, userId, name, email, hash, image, createdAt];
        const [rows] = yield db_1.default.query(sql, VALUES);
        const memberId = rows.insertId;
        let result;
        if (rows.affectedRows > 0) {
            let memberSql = `INSERT INTO assign_member_permissions(member_id, permission_id, action, created_at) VALUES`;
            try {
                for (var _h = true, permissions_1 = __asyncValues(permissions), permissions_1_1; permissions_1_1 = yield permissions_1.next(), _d = permissions_1_1.done, !_d;) {
                    _f = permissions_1_1.value;
                    _h = false;
                    try {
                        const element = _f;
                        // for (const permissionEle of permissionRows) {
                        //     if (permissionEle.id) {
                        //     }
                        // }
                        const permissionId = element.permissionId;
                        const action = element.action;
                        memberSql = memberSql + `(${memberId}, ${permissionId}, '${action}', '${createdAt}'),`;
                        result = memberSql.substring(0, memberSql.lastIndexOf(','));
                    }
                    finally {
                        _h = true;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_h && !_d && (_e = permissions_1.return)) yield _e.call(permissions_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            const [memberRows] = yield db_1.default.query(result);
            // await client.query("COMMIT");
            // const getMemberSql = `Select * from business_admin where email = '${email}' LIMIT 1`;
            // const [getMemberRows]:any = await pool.query(getMemberSql);
            // let token = await utility.jwtGenerate(getMemberRows[0].id);
            // delete getMemberRows[0].id;
            // delete getMemberRows[0].password;
            return res.status(200).json({
                status: true,
                // token,
                data: null,
                message: "Congratulations, Sub user added successfully !",
            });
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to Register, Please try again later");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
    // finally {
    //     await client.release();
    // }
});
exports.addTeamMember = addTeamMember;
// ====================================================================================================
// ====================================================================================================
const updateTeamMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _j, e_3, _k, _l;
    const client = yield db_1.default.getConnection();
    try {
        const userId = res.locals.jwt.userId;
        const { memberId, name, email, image } = req.body;
        const permissions = req.body.permissions;
        const createdAt = utility.dateWithFormat();
        // const hash = md5(password);
        const checkDupliSql = `SELECT * FROM business_admin WHERE deleted_at IS NULL AND email = ? AND id != ${memberId} LIMIT 1`;
        const dupliVALUES = [email];
        const [dupliRows] = yield db_1.default.query(checkDupliSql, dupliVALUES);
        const dupli = [];
        if (dupliRows.length > 0) {
            if (dupliRows[0].email === email) {
                dupli.push("email");
            }
            else {
                dupli.push("email");
            }
            console.log(dupli);
            const msg = `${dupli.join()} is duplicate, Please change it`;
            return res.status(400).json({
                status: false,
                data: null,
                message: msg,
            });
        }
        yield client.query("START TRANSACTION");
        // const sql = `INSERT INTO business_admin(type, admin_id, name, email, password, image, created_at) VALUES(?, ?, ?, ?, ?, ?, ?)`;
        const sql = `UPDATE business_admin SET name = ?, email = ?, image = ?, updated_at = ? WHERE id = ? AND admin_id = ?`;
        const VALUES = [name, email, image, createdAt, memberId, userId];
        const [rows] = yield client.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            try {
                // let memberSql = `INSERT INTO assign_member_permissions(member_id, permission_id, action, created_at) VALUES`;
                for (var _m = true, permissions_2 = __asyncValues(permissions), permissions_2_1; permissions_2_1 = yield permissions_2.next(), _j = permissions_2_1.done, !_j;) {
                    _l = permissions_2_1.value;
                    _m = false;
                    try {
                        const element = _l;
                        const permissionId = element.permissionId;
                        const action = element.action;
                        const permissionSql = `UPDATE assign_member_permissions SET action = ?, updated_at = ? WHERE permission_id = ? AND member_id = ?`;
                        const permissionVALUES = [action, createdAt, permissionId, memberId];
                        const [permissionRows] = yield client.query(permissionSql, permissionVALUES);
                    }
                    finally {
                        _m = true;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (!_m && !_j && (_k = permissions_2.return)) yield _k.call(permissions_2);
                }
                finally { if (e_3) throw e_3.error; }
            }
            yield client.query("COMMIT");
            return apiResponse.successResponse(res, "Data updated successfully !", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to Update, Please try again later");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
    finally {
        yield client.release();
    }
});
exports.updateTeamMember = updateTeamMember;
// ====================================================================================================
// ====================================================================================================
const teamMemberList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _o, e_4, _p, _q;
    try {
        const userId = res.locals.jwt.userId;
        const sql = `SELECT id, name, email, image, created_at FROM business_admin WHERE deleted_at IS NULL AND type = '${development_1.default.memberType}' AND admin_id = ${userId}`;
        const [rows] = yield db_1.default.query(sql);
        if (rows.length > 0) {
            let rowsIndex = -1;
            try {
                for (var _r = true, rows_1 = __asyncValues(rows), rows_1_1; rows_1_1 = yield rows_1.next(), _o = rows_1_1.done, !_o;) {
                    _q = rows_1_1.value;
                    _r = false;
                    try {
                        const element = _q;
                        rowsIndex++;
                        const permissionSql = `SELECT * FROM assign_member_permissions WHERE member_id = ${element.id}`;
                        const [permissionRows] = yield db_1.default.query(permissionSql);
                        rows[rowsIndex].permissions = permissionRows || [];
                    }
                    finally {
                        _r = true;
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (!_r && !_o && (_p = rows_1.return)) yield _p.call(rows_1);
                }
                finally { if (e_4) throw e_4.error; }
            }
            return apiResponse.successResponse(res, "Data Retrieved Successfully", rows);
        }
        else {
            return apiResponse.errorMessage(res, 400, "No data Found");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.teamMemberList = teamMemberList;
// ====================================================================================================
// ====================================================================================================
const deleteTeamMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const memberId = req.body.memberId;
        const createdAt = utility.dateWithFormat();
        if (!memberId || memberId === null || memberId === '') {
            return apiResponse.errorMessage(res, 400, "Member Id is required!");
        }
        const sql = `UPDATE business_admin SET deleted_at = ? WHERE admin_id = ? AND id = ?`;
        const VALUES = [createdAt, userId, memberId];
        const [rows] = yield db_1.default.query(sql, VALUES);
        return apiResponse.successResponse(res, "Member deleted succesfully", null);
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.deleteTeamMember = deleteTeamMember;
// ====================================================================================================
// ====================================================================================================
const teamMemberDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const memberId = req.query.memberId;
        const permissionArray = [];
        if (!memberId || memberId === null || memberId === '') {
            return apiResponse.errorMessage(res, 400, "Member Id is required!");
        }
        const sql = `SELECT id, name, email, image, created_at FROM business_admin WHERE deleted_at IS NULL AND type = '${development_1.default.memberType}' AND id = ${memberId} LIMIT 1`;
        const [rows] = yield db_1.default.query(sql);
        if (rows.length > 0) {
            const permissionSql = `SELECT assign_member_permissions.*, team_permissions.permission, team_permissions.slug FROM assign_member_permissions LEFT JOIN team_permissions ON team_permissions.id = assign_member_permissions.permission_id WHERE member_id = ${memberId}`;
            const [memberRows] = yield db_1.default.query(permissionSql);
            let permission = {};
            let memberRowsIndex = -1;
            for (const ele of memberRows) {
                permission[ele.slug] = ele.action;
                memberRowsIndex++;
                //.push(`${ele.slug}`+': '+ele.action)
            }
            console.log("permissionArray", permissionArray);
            rows[0].permissions = permission || [];
            return apiResponse.successResponse(res, "Data Retrieved Successfully", rows[0]);
        }
        else {
            return apiResponse.errorMessage(res, 400, "No data Found");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.teamMemberDetail = teamMemberDetail;
// ====================================================================================================
// ====================================================================================================
