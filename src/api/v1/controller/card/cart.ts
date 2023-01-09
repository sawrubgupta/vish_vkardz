import pool from '../../../../db';
import { Request, Response } from "express";
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";


export const addToCart =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !");
        }
        const productId = req.body.productId;
        const qty = req.body.qty;
        const createdAt = utility.dateWithFormat();

        const checkCartPoducts = `SELECT * FROM cart_details WHERE user_id = ${userId} AND product_id = ${productId}`;
        const [rows]:any = await pool.query(checkCartPoducts);

        if (rows.length > 0) {
            return apiResponse.errorMessage(res, 400, "Product already added in cart")
        } else {
            const addCartQuery = `INSERT INTO cart_details(user_id, product_id, qty, created_at) VALUES(?, ?, ?, ?)`;
            const VALUES = [userId, productId, qty, createdAt];
            const [rows]:any = await pool.query(addCartQuery, VALUES);
            
            if (rows.affectedRows > 0) {
                return apiResponse.successResponse(res, "Product added to cart", null);
            } else {
                return apiResponse.errorMessage(res, 400, "Failed to add product in cart, try again");
            }
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const getCart =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !");
        }

        const cartQuery = `SELECT cart_details.product_id, cart_details.qty, products.name, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, cart_details.created_at FROM products LEFT JOIN cart_details on cart_details.product_id = products.product_id LEFT JOIN product_price ON products.product_id = product_price.product_id WHERE cart_details.user_id = ${userId} ORDER BY created_at DESC`;
        const [rows]:any = await pool.query(cartQuery);

        if (rows.length > 0) {
            return apiResponse.successResponse(res, "Cart list are here!", rows);
        } else {
            return apiResponse.successResponse(res, "No data found", null);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const removeFromCart =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        const productId = req.query.productId;
        if (!productId || productId === "" || productId === undefined) {
            return apiResponse.errorMessage(res, 400, "productId is required!");
        }

        const sql = `DELETE FROM cart_details WHERE user_id = ${userId} AND product_id = ${productId}`;
        const [rows]:any = await pool.query(sql);

        return apiResponse.successResponse(res, "Product remove from cart", null)

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const updataCartQty =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        var productId = req.body.productId;
        const qty = req.body.qty;
        if (qty < 1) {
            return apiResponse.errorMessage(res, 400, "Quantity cannot be 0");
        }

        const sql = `UPDATE cart_details SET qty = ? WHERE user_id = ? AND product_id = ?`;
        const VALUES = [qty, userId, productId];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Qty updated successfully", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to update quantity, try again");
        }

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong")
    }
}

// ====================================================================================================
// ====================================================================================================

export const addCostmizeCard =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        const { productId, name, designation, logo, qty } = req.body;
        const createdAt = utility.dateWithFormat();

        const sql = `INSERT INTO customize_card(user_id, product_id, name, designation, qty, created_at) VALUES (?, ?, ?, ?, ?, ?)`;
        const VALUES = [userId, productId, name, designation, qty, createdAt];
        const [rows]:any = await pool.query(sql, VALUES);
        const customize_id = rows.insertId;

        const addLogoQuery = `INSERT INTO customize_card_files(customize_id, type, file_name) VALUES (?, ?, ?)`;
        const fileVALUES = [customize_id, "cusfile", logo];
        const [data]:any = await pool.query(addLogoQuery, fileVALUES);
        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Customization data Added Successfully", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to add Customization, try again");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const addDeliveryAddresess =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        const { name, addressType, phone, address, locality, city, state, pincode } = req.body;
        const createdAt = utility.dateWithFormat();

        const sql = `INSERT INTO delivery_addresses(user_id, address_type, name, phone, address, locality, city, state, pincode, created_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const VALUES = [userId, addressType, name, phone, address, locality, city, state, pincode, createdAt];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Delivery address added successfully", null)
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to add address, try again")
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const getDeliveryAddresses =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;

        const sql = `SELECT id, address_type, name, phone, address, locality, city, state, pincode FROM delivery_addresses WHERE user_id = ${userId}`;
        const [rows]:any = await pool.query(sql);

        if (rows.length > 0) {
            return apiResponse.successResponse(res, "Address list are here", rows);
        } else {
            return apiResponse.successResponse(res, "No data found", null);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const deleteDaliveryAddress =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        const addressId = req.query.addressId;

        const sql = `DELETE FROM delivery_addresses WHERE user_id = ? AND id = ?`;
        const VALUES = [userId, addressId];
        const [rows]:any = await pool.query(sql, VALUES);

        return apiResponse.successResponse(res, "Address deleted successfully", null);
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
