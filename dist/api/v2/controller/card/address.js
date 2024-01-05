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
exports.latLong = exports.defaultAddress = exports.deleteDaliveryAddress = exports.getDeliveryAddresses = exports.updateDeliveryAddresess = exports.addDeliveryAddresess = void 0;
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const responseMsg_1 = __importDefault(require("../../config/responseMsg"));
const response = responseMsg_1.default.card.address;
const addDeliveryAddresess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const client = await pool.getConnection();
    try {
        const userId = res.locals.jwt.userId;
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
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        // await client.query("COMMIT");
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, response.addDeliveryAddresess.successMsg, null);
        }
        else {
            return apiResponse.errorMessage(res, 400, response.addDeliveryAddresess.failedMsg);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
    // finally {
    //     await client.release();
    // }
});
exports.addDeliveryAddresess = addDeliveryAddresess;
// ====================================================================================================
// ====================================================================================================
const updateDeliveryAddresess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const addressId = req.body.addressId;
        const { name, addressType, phone, email, address, locality, city, state, pincode, country, country_name, currencyCode } = req.body;
        const createdAt = utility.dateWithFormat();
        // const checkDeliveryCharges = `SELECT is_delivered, usd_price, inr_price FROM delivery_charges WHERE zipcode = '${pincode}' LIMIT 1`;
        // const [deliveryChargesRows]:any = await pool.query(checkDeliveryCharges);
        // if (deliveryChargesRows.length === 0) return apiResponse.errorMessage(res, 400, "Invalid zipcode or Delivery not available in this pincode!");
        const sql = `UPDATE delivery_addresses SET currency_code = ?, address_type = ?, name = ?, phone = ?, email = ?, address = ?, locality = ?, city = ?, state = ?, pincode = ?, country = ?, country_name = ? WHERE user_id = ? AND id = ?`;
        const VALUES = [currencyCode, addressType, name, phone, email, address, locality, city, state, pincode, country, country_name, userId, addressId];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, response.updateDeliveryAddresess.successMsg, null);
        }
        else {
            return apiResponse.errorMessage(res, 400, response.updateDeliveryAddresess.failedMsg);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.updateDeliveryAddresess = updateDeliveryAddresess;
// ====================================================================================================
// ====================================================================================================
const getDeliveryAddresses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const sql = `SELECT * FROM delivery_addresses WHERE user_id = ${userId} ORDER BY is_default DESC`;
        const [rows] = yield dbV2_1.default.query(sql);
        if (rows.length > 0) {
            return apiResponse.successResponse(res, response.getDeliveryAddresses.successMsg, rows);
        }
        else {
            return apiResponse.successResponse(res, response.getDeliveryAddresses.noDataFoundMsg, null);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.getDeliveryAddresses = getDeliveryAddresses;
// ====================================================================================================
// ====================================================================================================
const deleteDaliveryAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const addressId = req.query.addressId;
        const sql = `DELETE FROM delivery_addresses WHERE user_id = ? AND id = ?`;
        const VALUES = [userId, addressId];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        return apiResponse.successResponse(res, response.deleteDaliveryAddress.successMsg, null);
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.deleteDaliveryAddress = deleteDaliveryAddress;
// ====================================================================================================
// ====================================================================================================
const defaultAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const client = await pool.getConnection();
    try {
        const userId = res.locals.jwt.userId;
        const addressId = req.body.addressId;
        const createdAt = utility.dateWithFormat();
        if (!addressId || addressId === null || addressId === undefined)
            return apiResponse.errorMessage(res, 400, response.defaultAddress.nullAddressId);
        // await client.query("START TRANSACTION");
        const getAddressQuery = `SELECT id, is_default FROM delivery_addresses WHERE user_id = ${userId} AND is_default = 1`;
        const [addressRows] = yield dbV2_1.default.query(getAddressQuery);
        if (addressRows.length > 0) {
            const removeDefaultQuery = `UPDATE delivery_addresses SET is_default = 0 WHERE user_id = ${userId} AND id = ${addressRows[0].id}`;
            const [removeRows] = yield dbV2_1.default.query(removeDefaultQuery);
        }
        const adDefaultQuery = `UPDATE delivery_addresses SET is_default = 1 WHERE user_id = ${userId} AND id = ${addressId}`;
        const [rows] = yield dbV2_1.default.query(adDefaultQuery);
        // await client.query("COMMIT");
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, response.defaultAddress.successMsg, null);
        }
        else {
            return apiResponse.errorMessage(res, 400, response.defaultAddress.failedMsg);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
    // finally {
    //     await client.release();
    // }
});
exports.defaultAddress = defaultAddress;
// ====================================================================================================
// ====================================================================================================
const latLong = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
    }
    catch (e) {
        console.log(e);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.latLong = latLong;
// ====================================================================================================
// ====================================================================================================
