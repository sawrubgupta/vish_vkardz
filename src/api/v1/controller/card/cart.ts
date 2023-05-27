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

        const checkCartPoducts = `SELECT id FROM cart_details WHERE user_id = ${userId} AND product_id = ${productId} limit 1`;
        const [cartRows]:any = await pool.query(checkCartPoducts);

        if (cartRows.length > 0) {
            return apiResponse.errorMessage(res, 400, "Product already added in cart!")
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
    // const client = await pool.getConnection();
    try {
        const userId:string = res.locals.jwt.userId;
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !");
        }


        // await client.query("START TRANSACTION");
        const cartQuery = `SELECT cart_details.product_id, cart_details.qty, products.name, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, products.is_customizable, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating, cart_details.created_at FROM products LEFT JOIN cart_details on cart_details.product_id = products.product_id LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE cart_details.user_id = ${userId} GROUP BY products.product_id ORDER BY created_at DESC`;
        const [rows]:any = await pool.query(cartQuery);
        
        if (rows.length > 0) {

        const addressQuery = `SELECT * FROM delivery_addresses WHERE user_id = ${userId} ORDER BY is_default = 1 DESC LIMIT 1`;
        const [addressRows]:any = await pool.query(addressQuery);

        const userDetailQuery = `SELECT username, name, email, phone, country, thumb FROM users WHERE id = ${userId} LIMIT 1`;
        const [userRows]:any = await pool.query(userDetailQuery);

        const gstInPercent = 18;
        var totatAmount: any = 0;
        let amount:any;
        let gstPrice:any;
        let deliveryCharges:any;
        let grandTotal:any;
        // for (let i = 0; i < rows.length; i++) {
        //     var amount: any = rows[i].inr_selling_price * rows[i].qty;
        //     totatAmount = totatAmount + amount;
        //     rows[i].totalPriceWithQty = amount;
        // }
        for (let i = 0; i < rows.length; i++) {
            if (addressRows.length > 0) {
                // const checkDeliveryCharges = `SELECT is_delivered, usd_price, inr_price FROM delivery_charges WHERE zipcode = '${addressRows[0].pincode}' LIMIT 1`;
                // const [deliveryChargesRows]:any = await pool.query(checkDeliveryCharges);
        
                // if (deliveryChargesRows.length === 0) return apiResponse.errorMessage(res, 400, "Invalid zipcode or Delivery not available in this pincode!");
        
                // if (deliveryChargesRows[0].is_delivered === 0) return apiResponse.errorMessage(res, 400, "Delivery not available in this pincode!");
        
                if (addressRows[0].currency_code == '91' || addressRows[0].currency_code == '+91') {
                    amount = rows[i].inr_selling_price * rows[i].qty;
                    totatAmount = totatAmount + amount;
                    gstPrice = (totatAmount*gstInPercent)/100;
                    deliveryCharges = 100; //deliveryChargesRows[0].inr_price || 100;
                    grandTotal = totatAmount+deliveryCharges+gstPrice;
            
                } else {
                    amount = rows[i].usd_selling_price * rows[i].qty;
                    totatAmount = totatAmount + amount;
                    gstPrice = 0;
                    deliveryCharges = 22; //deliveryChargesRows[0].usd_price || 22;
                    grandTotal = totatAmount+deliveryCharges;
            
                }    
            } else {
                if (userRows[0].country == '91' || userRows[0].country == '+91') {
                    amount = rows[i].inr_selling_price * rows[i].qty;
                    totatAmount = totatAmount + amount;
                    gstPrice = (totatAmount*gstInPercent)/100;
                    deliveryCharges = 100;
                    grandTotal = totatAmount+deliveryCharges+gstPrice;
            

                } else {
                    amount = rows[i].usd_selling_price * rows[i].qty;
                    totatAmount = totatAmount + amount;
                    gstPrice = 0;
                    deliveryCharges = 22;
                    grandTotal = totatAmount+deliveryCharges;
            
                } 
                // amount = rows[i].inr_selling_price * rows[i].qty;
            }
            rows[i].totalPriceWithQty = amount;
        }




        // await client.query("COMMIT");
            userRows[0].cardProducts = rows || [];
            userRows[0].userAddress = addressRows[0] || null;
            userRows[0].deliveryCharge = deliveryCharges;
            userRows[0].gstInPercent = gstInPercent;
            userRows[0].itemsTotal = totatAmount;
            userRows[0].gstAmount = gstPrice;
            userRows[0].grandTotal = grandTotal;
    
            return apiResponse.successResponse(res, "Cart list are here!", userRows);
        } else {
            return apiResponse.successResponse(res, "No data found", null);
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
        // const { productId, name, designation, logo, qty } = req.body;
        const customizeCard = req.body.customizeCard;
        const createdAt = utility.dateWithFormat();

        let sql = `INSERT INTO customize_card(user_id, product_id, name, designation, qty, created_at) VALUES `;

        let result:any
        for (const element of customizeCard) {
            const productId = element.productId;
            const name = element.name;
            const designation = element.designation; 
            const logo = element.logo;
            const qty = element.qty;

            sql = sql + `(${userId}, ${productId}, '${name}', '${designation}', ${qty},  '${createdAt}'),`;
            result = sql.substring(0,sql.lastIndexOf(','));

        }
        const [rows]:any = await pool.query(result);
        const customize_id = rows.insertId;


        // const addLogoQuery = `INSERT INTO customize_card_files(customize_id, type, file_name) VALUES (?, ?, ?)`;
        // const fileVALUES = [customize_id, "cusfile", logo];
        // const [data]:any = await pool.query(addLogoQuery, fileVALUES);
        if (rows.affectedRows > 0) {
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
        const { name, addressType, phone, address, locality, city, state, pincode, currencyCode } = req.body;
        const createdAt = utility.dateWithFormat();

        const checkDeliveryCharges = `SELECT is_delivered, usd_price, inr_price FROM delivery_charges WHERE zipcode = '${pincode}' LIMIT 1`;
        const [deliveryChargesRows]:any = await pool.query(checkDeliveryCharges);

        if (deliveryChargesRows.length === 0) return apiResponse.errorMessage(res, 400, "Invalid zipcode or Delivery not available in this pincode!");

        // if (deliveryChargesRows[0].is_delivered === 0) return apiResponse.errorMessage(res, 400, "Delivery not available in this pincode!");

        const sql = `INSERT INTO delivery_addresses(user_id, currency_code, address_type, name, phone, address, locality, city, state, pincode, created_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const VALUES = [userId, currencyCode, addressType, name, phone, address, locality, city, state, pincode, createdAt];
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

export const updateDeliveryAddresess =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        const addressId = req.body.addressId;
        const { name, addressType, phone, address, locality, city, state, pincode, currencyCode } = req.body;
        const createdAt = utility.dateWithFormat();
        
        const checkDeliveryCharges = `SELECT is_delivered, usd_price, inr_price FROM delivery_charges WHERE zipcode = '${pincode}' LIMIT 1`;
        const [deliveryChargesRows]:any = await pool.query(checkDeliveryCharges);

        if (deliveryChargesRows.length === 0) return apiResponse.errorMessage(res, 400, "Invalid zipcode or Delivery not available in this pincode!");

        const sql = `UPDATE delivery_addresses SET currency_code = ?, address_type = ?, name = ?, phone = ?, address = ?, locality = ?, city = ?, state = ?, pincode = ? WHERE user_id = ? AND id = ?`
        const VALUES = [currencyCode, addressType, name, phone, address, locality, city, state, pincode, userId, addressId];
        const [rows]:any = await pool.query(sql, VALUES);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Delivery Address Updated Successfully", null)
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to Update address, try again")
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

        const sql = `SELECT id, address_type, currency_code, name, phone, address, locality, city, state, pincode, is_default FROM delivery_addresses WHERE user_id = ${userId} ORDER BY is_default DESC`;
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

export const defaultAddres =async (req:Request, res:Response) => {
    const client = await pool.getConnection();
    try {
        const userId:string = res.locals.jwt.userId;
        const addressId = req.body.addressId;
        const createdAt = utility.dateWithFormat();
        if (!addressId || addressId === null || addressId === undefined) {
            return apiResponse.errorMessage(res, 400, "Address Id is required!");
        }
        await client.query("START TRANSACTION");

        const getAddressQuery = `SELECT id, is_default FROM delivery_addresses WHERE user_id = ${userId} AND is_default = 1`;
        const [addressRows]:any = await client.query(getAddressQuery);

        if (addressRows.length > 0) {
            const removeDefaultQuery = `UPDATE delivery_addresses SET is_default = 0 WHERE user_id = ${userId} AND id = ${addressRows[0].id}`;
            const [removeRows]:any = await client.query(removeDefaultQuery);
        }

        const adDefaultQuery = `UPDATE delivery_addresses SET is_default = 1 WHERE user_id = ${userId} AND id = ${addressId}`;
        const [rows]:any = await client.query(adDefaultQuery);

        await client.query("COMMIT");
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Default Delivery Address Updated Successfully", null)
        } else {
            return apiResponse.errorMessage(res, 400, "Failed!, try again")
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
