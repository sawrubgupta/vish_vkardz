import { Request, Response } from "express";
import pool from "../../../../db";
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config from "../../config/development";
import md5 from 'md5';

export const getPermissionList = async (req: Request, res: Response) => {
    try {
        const sql = `SELECT * FROM team_permissions WHERE status = 1`;
        const [rows]: any = await pool.query(sql);

        return apiResponse.successResponse(res, "Permission List are here", rows);
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something wnt wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const addTeamMember = async (req: Request, res: Response) => {
    // const client = await pool.getConnection();
    try {
        const userId = res.locals.jwt.userId;
        const { name, email, password, image } = req.body;
        const permissions = req.body.permissions;
        const createdAt = utility.dateWithFormat();
        const hash = md5(password);

        const checkDupliSql = `SELECT * FROM business_admin WHERE deleted_at IS NULL AND email = ? LIMIT 1`;
        const dupliVALUES = [email];
        const [dupliRows]: any = await pool.query(checkDupliSql, dupliVALUES);

        const dupli = [];
        if (dupliRows.length > 0) {
            if (dupliRows[0].email === email) {
                dupli.push("email");
            } else {
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
        const VALUES = [config.memberType, userId, name, email, hash, image, createdAt];
        const [rows]: any = await pool.query(sql, VALUES);

        const memberId = rows.insertId;
        let result: any;
        if (rows.affectedRows > 0) {
            let memberSql = `INSERT INTO assign_member_permissions(member_id, permission_id, action, created_at) VALUES`;
            for await (const element of permissions) {
                const permissionId = element.permissionId;
                const action = element.action;

                memberSql = memberSql + `(${memberId}, ${permissionId}, '${action}', '${createdAt}'),`;
                result = memberSql.substring(0, memberSql.lastIndexOf(','));
            }
            const [memberRows]: any = await pool.query(result);

            // await client.query("COMMIT");

            // const getMemberSql = `Select * from business_admin where email = '${email}' LIMIT 1`;
            // const [getMemberRows]:any = await pool.query(getMemberSql);

            // let token = await utility.jwtGenerate(getMemberRows[0].id);
            // delete getMemberRows[0].id;
            // delete getMemberRows[0].password;
    
            return res.status(200).json({
                status: true,
                // token,
                data: null, //getMemberRows[0],
                message: "Congratulations, Sub user added successfully !",
            });
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to Register, Please try again later");
        }

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    } 
    // finally {
    //     await client.release();
    // }
}

// ====================================================================================================
// ====================================================================================================

export const updateTeamMember = async (req: Request, res: Response) => {
    const client = await pool.getConnection();
    try {
        const userId = res.locals.jwt.userId;
        const { memberId, name, email, image } = req.body;
        const permissions = req.body.permissions;
        const createdAt = utility.dateWithFormat();
        // const hash = md5(password);

        const checkDupliSql = `SELECT * FROM business_admin WHERE deleted_at IS NULL AND email = ? AND id != ${memberId} LIMIT 1`;
        const dupliVALUES = [email];
        const [dupliRows]: any = await pool.query(checkDupliSql, dupliVALUES);

        const dupli = [];
        if (dupliRows.length > 0) {
            if (dupliRows[0].email === email) {
                dupli.push("email");
            } else {
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
        await client.query("START TRANSACTION");

        // const sql = `INSERT INTO business_admin(type, admin_id, name, email, password, image, created_at) VALUES(?, ?, ?, ?, ?, ?, ?)`;
        const sql = `UPDATE business_admin SET name = ?, email = ?, image = ?, updated_at = ? WHERE id = ? AND admin_id = ?`
        const VALUES = [name, email, image, createdAt, memberId, userId];
        const [rows]: any = await client.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            // let memberSql = `INSERT INTO assign_member_permissions(member_id, permission_id, action, created_at) VALUES`;
            for await (const element of permissions) {
                const permissionId = element.permissionId;
                const action = element.action;

                const permissionSql = `UPDATE assign_member_permissions SET action = ?, updated_at = ? WHERE permission_id = ? AND member_id = ?`;
                const permissionVALUES = [action, createdAt, permissionId, memberId];
                const [permissionRows]:any = await client.query(permissionSql, permissionVALUES);

            }

            await client.query("COMMIT");

            return apiResponse.successResponse(res, "Data updated successfully !", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to Register, Please try again later");
        }

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    } finally {
        await client.release();
    }
}

// ====================================================================================================
// ====================================================================================================

export const teamMemberList =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;

        const sql = `SELECT id, name, email, image, created_at FROM business_admin WHERE deleted_at IS NULL AND type = '${config.memberType}' AND admin_id = ${userId}`;
        const [rows]:any = await pool.query(sql);

        if (rows.length > 0) {
            let rowsIndex = -1;
            for await(const element of rows) {
                rowsIndex++;

                const permissionSql = `SELECT * FROM assign_member_permissions WHERE member_id = ${element.id}`
                const [permissionRows]:any = await pool.query(permissionSql);
                rows[rowsIndex].permissions = permissionRows || [];
            }

            return apiResponse.successResponse(res, "Data Retrieved Successfully", rows);
        } else {
            return apiResponse.errorMessage(res, 400, "No data Found");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const deleteTeamMember =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const memberId = req.body.memberId;
        const createdAt = utility.dateWithFormat();

        if (!memberId || memberId === null || memberId === '') {
            return apiResponse.errorMessage(res, 400, "Member Id is required!");
        }
        const sql = `UPDATE business_admin SET deleted_at = ? WHERE admin_id = ? AND id = ?`;
        const VALUES = [createdAt, userId, memberId];
        const [rows]:any = await pool.query(sql , VALUES);
        
        return apiResponse.successResponse(res, "Member deleted succesfully", null);
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const teamMemberDetail =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const memberId = req.query.memberId;

        if (!memberId || memberId === null || memberId === '') {
            return apiResponse.errorMessage(res, 400, "Member Id is required!");
        }

        const sql = `SELECT id, name, email, image, created_at FROM business_admin WHERE deleted_at IS NULL AND type = '${config.memberType}' AND id = ${memberId} LIMIT 1`;
        const [rows]:any = await pool.query(sql);

        if (rows.length > 0) {
            const permissionSql = `SELECT assign_member_permissions.*, team_permissions.permission, team_permissions.slug FROM assign_member_permissions LEFT JOIN team_permissions ON team_permissions.id = assign_member_permissions.permission_id WHERE member_id = ${memberId}`;
            const [memberRows]:any = await pool.query(permissionSql);

            rows[0].permissions = memberRows || [];

            return apiResponse.successResponse(res, "Data Retrieved Successfully", rows[0]);
        } else {
            return apiResponse.errorMessage(res, 400, "No data Found");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
