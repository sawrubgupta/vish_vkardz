import pool from '../../../../dbV2';
import { Request, Response } from "express";
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import responseMsg from '../../config/responseMsg';

const response = responseMsg.card.address;


export const addDeliveryAddresess = async (req: Request, res: Response) => {
    // const client = await pool.getConnection();
    try {
        const userId: string = res.locals.jwt.userId;
        const { name, addressType, phone, email, address, locality, city, state, pincode, country, country_name, currencyCode } = req.body;
        // let isDefault = req.body.isDefault;
        const createdAt = utility.dateWithFormat();

        // await client.query("START TRANSACTION");

        // if (!isDefault || isDefault === null) isDefault = 0;
        // if (isDefault === 1) {
            // const getAddressQuery = `SELECT id, is_default FROM delivery_addresses WHERE user_id = ${userId} AND is_default = 1`;
            // const [addressRows]: any = await client.query(getAddressQuery);
    
            // if (addressRows.length > 0) {
            //     const removeDefaultQuery = `UPDATE delivery_addresses SET is_default = 0 WHERE user_id = ${userId} AND id = ${addressRows[0].id}`;
            //     const [removeRows]: any = await client.query(removeDefaultQuery);
            // }    
        //     const removeDefaultQuery = `UPDATE delivery_addresses SET is_default = 0 WHERE user_id = ${userId}`;
        //     const [removeRows]: any = await client.query(removeDefaultQuery);
        // }
        
        // const checkDeliveryCharges = `SELECT is_delivered, usd_price, inr_price FROM delivery_charges WHERE zipcode = '${pincode}' LIMIT 1`;
        // const [deliveryChargesRows]:any = await pool.query(checkDeliveryCharges);

        // if (deliveryChargesRows.length === 0) return apiResponse.errorMessage(res, 400, "Invalid zipcode or Delivery not available in this pincode!");

        // if (deliveryChargesRows[0].is_delivered === 0) return apiResponse.errorMessage(res, 400, "Delivery not available in this pincode!");

        const sql = `INSERT INTO delivery_addresses(user_id, currency_code, address_type, name, phone, email, address, locality, city, state, pincode, country, country_name, is_default, created_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const VALUES = [userId, currencyCode, addressType, name, phone, email, address, locality, city, state, pincode, country, country_name, 0, createdAt];
        const [rows]: any = await pool.query(sql, VALUES);

        // await client.query("COMMIT");

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, response.addDeliveryAddresess.successMsg, null);
        } else {
            return apiResponse.errorMessage(res, 400, response.addDeliveryAddresess.failedMsg);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    } 
    // finally {
    //     await client.release();
    // }
}

// ====================================================================================================
// ====================================================================================================

export const updateDeliveryAddresess = async (req: Request, res: Response) => {
    try {
        const userId: string = res.locals.jwt.userId;
        const addressId = req.body.addressId;
        const { name, addressType, phone, email, address, locality, city, state, pincode, country, country_name, currencyCode } = req.body;
        const createdAt = utility.dateWithFormat();

        // const checkDeliveryCharges = `SELECT is_delivered, usd_price, inr_price FROM delivery_charges WHERE zipcode = '${pincode}' LIMIT 1`;
        // const [deliveryChargesRows]:any = await pool.query(checkDeliveryCharges);

        // if (deliveryChargesRows.length === 0) return apiResponse.errorMessage(res, 400, "Invalid zipcode or Delivery not available in this pincode!");

        const sql = `UPDATE delivery_addresses SET currency_code = ?, address_type = ?, name = ?, phone = ?, email = ?, address = ?, locality = ?, city = ?, state = ?, pincode = ?, country = ?, country_name = ? WHERE user_id = ? AND id = ?`
        const VALUES = [currencyCode, addressType, name, phone, email, address, locality, city, state, pincode, country, country_name, userId, addressId];
        const [rows]: any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, response.updateDeliveryAddresess.successMsg, null);
        } else {
            return apiResponse.errorMessage(res, 400, response.updateDeliveryAddresess.failedMsg);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const getDeliveryAddresses = async (req: Request, res: Response) => {
    try {
        const userId: string = res.locals.jwt.userId;

        const sql = `SELECT * FROM delivery_addresses WHERE user_id = ${userId} ORDER BY is_default DESC`;
        const [rows]: any = await pool.query(sql);

        if (rows.length > 0) {
            return apiResponse.successResponse(res, response.getDeliveryAddresses.successMsg, rows);
        } else {
            return apiResponse.successResponse(res, response.getDeliveryAddresses.noDataFoundMsg, null);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const deleteDaliveryAddress = async (req: Request, res: Response) => {
    try {
        const userId: string = res.locals.jwt.userId;
        const addressId = req.query.addressId;

        const sql = `DELETE FROM delivery_addresses WHERE user_id = ? AND id = ?`;
        const VALUES = [userId, addressId];
        const [rows]: any = await pool.query(sql, VALUES);

        return apiResponse.successResponse(res, response.deleteDaliveryAddress.successMsg, null);
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const defaultAddress = async (req: Request, res: Response) => {
    // const client = await pool.getConnection();
    try {
        const userId: string = res.locals.jwt.userId;
        const addressId = req.body.addressId;
        const createdAt = utility.dateWithFormat();
        if (!addressId || addressId === null || addressId === undefined) return apiResponse.errorMessage(res, 400, response.defaultAddress.nullAddressId);
        
        // await client.query("START TRANSACTION");

        const getAddressQuery = `SELECT id, is_default FROM delivery_addresses WHERE user_id = ${userId} AND is_default = 1`;
        const [addressRows]: any = await pool.query(getAddressQuery);

        if (addressRows.length > 0) {
            const removeDefaultQuery = `UPDATE delivery_addresses SET is_default = 0 WHERE user_id = ${userId} AND id = ${addressRows[0].id}`;
            const [removeRows]: any = await pool.query(removeDefaultQuery);
        }

        const adDefaultQuery = `UPDATE delivery_addresses SET is_default = 1 WHERE user_id = ${userId} AND id = ${addressId}`;
        const [rows]: any = await pool.query(adDefaultQuery);

        // await client.query("COMMIT");
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, response.defaultAddress.successMsg, null);
        } else {
            return apiResponse.errorMessage(res, 400, response.defaultAddress.failedMsg);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    } 
    // finally {
    //     await client.release();
    // }
}

// ====================================================================================================
// ====================================================================================================

export const latLong =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;
    } catch (e) {
        console.log(e);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================
