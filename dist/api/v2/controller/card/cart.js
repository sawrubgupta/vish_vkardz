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
exports.addCostmizeCard = exports.updateCartQty = exports.removeFromCart = exports.cartCount = exports.getCart = exports.addToCart = void 0;
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const responseMsg_1 = __importDefault(require("../../config/responseMsg"));
const cartResponseMsg = responseMsg_1.default.card.cart;
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, cartResponseMsg.addToCart.nullUserId);
        const productId = req.body.productId;
        const qty = req.body.qty;
        const createdAt = utility.dateWithFormat();
        const checkCartPoducts = `SELECT id FROM cart_details WHERE user_id = ${userId} AND product_id = ${productId} limit 1`;
        const [cartRows] = yield dbV2_1.default.query(checkCartPoducts);
        if (cartRows.length > 0) {
            return apiResponse.errorMessage(res, 400, cartResponseMsg.addToCart.prodctAlreadyInCart);
        }
        else {
            const addCartQuery = `INSERT INTO cart_details(user_id, product_id, qty, created_at) VALUES(?, ?, ?, ?)`;
            const VALUES = [userId, productId, qty, createdAt];
            const [rows] = yield dbV2_1.default.query(addCartQuery, VALUES);
            if (rows.affectedRows > 0) {
                return apiResponse.successResponse(res, cartResponseMsg.addToCart.successMsg, null);
            }
            else {
                return apiResponse.errorMessage(res, 400, cartResponseMsg.addToCart.failedMsg);
            }
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.addToCart = addToCart;
// ====================================================================================================
// ====================================================================================================
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const client = await pool.getConnection();
    try {
        const userId = res.locals.jwt.userId;
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, cartResponseMsg.getCart.nullUserId);
        const countryId = req.query.countryId;
        // await client.query("START TRANSACTION");
        const cartQuery = `SELECT cart_details.product_id, cart_details.qty, products.name, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, products.is_customizable, (product_price.usd_selling_price*cart_details.qty) AS usd_selling_price, (product_price.usd_mrp_price*cart_details.qty) AS usd_mrp_price, (product_price.aed_selling_price*cart_details.qty) AS aed_selling_price, (product_price.aed_mrp_price*cart_details.qty) AS aed_mrp_price, (product_price.inr_selling_price*cart_details.qty) AS inr_selling_price, (product_price.inr_mrp_price*cart_details.qty) AS inr_mrp_price, (product_price.qar_selling_price*cart_details.qty) AS qar_selling_price, (product_price.qar_mrp_price*cart_details.qty) AS qar_mrp_price, COUNT(product_rating.id) AS totalRating, AVG(COALESCE(product_rating.rating, 0)) AS averageRating, cart_details.created_at FROM products LEFT JOIN cart_details on cart_details.product_id = products.product_id LEFT JOIN product_price ON products.product_id = product_price.product_id LEFT JOIN product_rating ON products.product_id = product_rating.product_id WHERE cart_details.user_id = ${userId} GROUP BY products.product_id ORDER BY created_at DESC`;
        const [rows] = yield dbV2_1.default.query(cartQuery);
        if (rows.length > 0) {
            const addressQuery = `SELECT * FROM delivery_addresses WHERE user_id = ${userId} ORDER BY is_default = 1 DESC LIMIT 1`;
            const [addressRows] = yield dbV2_1.default.query(addressQuery);
            const userDetailQuery = `SELECT username, name, email, phone, country, thumb FROM users WHERE id = ${userId} LIMIT 1`;
            const [userRows] = yield dbV2_1.default.query(userDetailQuery);
            const gstInPercent = 0;
            var totatAmount = 0;
            let amount;
            let gstPrice;
            let deliveryCharges;
            let grandTotal;
            // for (let i = 0; i < rows.length; i++) {
            //     var amount: any = rows[i].inr_selling_price * rows[i].qty;
            //     totatAmount = totatAmount + amount;
            //     rows[i].totalPriceWithQty = amount;
            // }
            let productIdsArr = [];
            for (let i = 0; i < rows.length; i++) {
                let productId = rows[i].product_id;
                productIdsArr.push(productId);
                if (!countryId || countryId == null) {
                    if (addressRows.length > 0) {
                        // const checkDeliveryCharges = `SELECT is_delivered, usd_price, inr_price FROM delivery_charges WHERE zipcode = '${addressRows[0].pincode}' LIMIT 1`;
                        // const [deliveryChargesRows]:any = await pool.query(checkDeliveryCharges);
                        // if (deliveryChargesRows.length === 0) return apiResponse.errorMessage(res, 400, "Invalid zipcode or Delivery not available in this pincode!");
                        // if (deliveryChargesRows[0].is_delivered === 0) return apiResponse.errorMessage(res, 400, "Delivery not available in this pincode!");
                        if (addressRows[0].country == '91' || addressRows[0].country == '+91' || addressRows[0].currency_code == '91') {
                            // amount = rows[i].inr_selling_price * rows[i].qty;
                            amount = rows[i].inr_selling_price;
                            totatAmount = totatAmount + amount;
                            // gstPrice = (totatAmount * gstInPercent) / 100;
                            // deliveryCharges = 100; //deliveryChargesRows[0].inr_price || 100;
                            gstPrice = 0; //(totatAmount * gstInPercent) / 100;
                            deliveryCharges = 0; //deliveryChargesRows[0].inr_price || 100;
                            grandTotal = totatAmount + deliveryCharges + gstPrice;
                        }
                        else {
                            // amount = rows[i].usd_selling_price * rows[i].qty;
                            amount = rows[i].usd_selling_price;
                            totatAmount = totatAmount + amount;
                            // gstPrice = 0;
                            // deliveryCharges = 22; //deliveryChargesRows[0].usd_price || 22;
                            gstPrice = 0;
                            deliveryCharges = 0; //deliveryChargesRows[0].usd_price || 22;
                            grandTotal = totatAmount + deliveryCharges;
                        }
                    }
                    else {
                        if (userRows[0].country == '91' || userRows[0].country == '+91') {
                            // amount = rows[i].inr_selling_price * rows[i].qty;
                            amount = rows[i].inr_selling_price;
                            totatAmount = totatAmount + amount;
                            // gstPrice = (totatAmount * gstInPercent) / 100;
                            // deliveryCharges = 100;
                            gstPrice = 0; //(totatAmount * gstInPercent) / 100;
                            deliveryCharges = 0;
                            grandTotal = totatAmount + deliveryCharges + gstPrice;
                        }
                        else {
                            // amount = rows[i].usd_selling_price * rows[i].qty;
                            amount = rows[i].usd_selling_price;
                            totatAmount = totatAmount + amount;
                            // gstPrice = 0;
                            // deliveryCharges = 22;
                            gstPrice = 0; //(totatAmount * gstInPercent) / 100;
                            deliveryCharges = 0;
                            grandTotal = totatAmount + deliveryCharges;
                        }
                        // amount = rows[i].inr_selling_price * rows[i].qty;
                    }
                }
                else {
                    if (countryId == '91' || countryId == '+91') {
                        // amount = rows[i].inr_selling_price * rows[i].qty;
                        amount = rows[i].inr_selling_price;
                        totatAmount = totatAmount + amount;
                        // gstPrice = (totatAmount * gstInPercent) / 100;
                        // deliveryCharges = 100;
                        gstPrice = 0; //(totatAmount * gstInPercent) / 100;
                        deliveryCharges = 0;
                        grandTotal = totatAmount + deliveryCharges + gstPrice;
                    }
                    else {
                        // amount = rows[i].usd_selling_price * rows[i].qty;
                        amount = rows[i].usd_selling_price;
                        totatAmount = totatAmount + amount;
                        // gstPrice = 0;
                        // deliveryCharges = 22;
                        gstPrice = 0; //(totatAmount * gstInPercent) / 100;
                        deliveryCharges = 0;
                        grandTotal = totatAmount + deliveryCharges;
                    }
                }
                rows[i].totalPriceWithQty = amount;
            }
            const productImageSql = `SELECT product_id, image FROM product_image WHERE product_id IN(${productIdsArr})`;
            const [productImageRows] = yield dbV2_1.default.query(productImageSql);
            let rowIndex = -1;
            let imageDataIndex = -1;
            for (const element of rows) {
                rowIndex++;
                rows[rowIndex].productImg = [];
                for (const imgEle of productImageRows) {
                    imageDataIndex++;
                    if (element.product_id === imgEle.product_id) {
                        (rows[rowIndex].productImg).push(imgEle.image);
                    }
                }
            }
            // await client.query("COMMIT");
            userRows[0].cardProducts = rows || [];
            userRows[0].userAddress = addressRows[0] || null;
            userRows[0].deliveryCharge = deliveryCharges;
            userRows[0].gstInPercent = gstInPercent;
            userRows[0].itemsTotal = totatAmount;
            userRows[0].gstAmount = gstPrice;
            userRows[0].grandTotal = grandTotal;
            return apiResponse.successResponse(res, cartResponseMsg.getCart.successMsg, userRows);
        }
        else {
            return apiResponse.successResponse(res, cartResponseMsg.getCart.noDataFoundMsg, null);
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
exports.getCart = getCart;
// ====================================================================================================
// ====================================================================================================
const cartCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const sql = `SELECT COUNT(id) AS totalItem FROM cart_details WHERE user_id = ${userId}`;
        const [rows] = yield dbV2_1.default.query(sql);
        console.log("rows", rows);
        return apiResponse.successResponse(res, "Data retrieved successfuly", rows[0]);
    }
    catch (e) {
        console.log(e);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.cartCount = cartCount;
// ====================================================================================================
// ====================================================================================================
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const productId = req.query.productId;
        if (!productId || productId === "" || productId === undefined)
            return apiResponse.errorMessage(res, 400, cartResponseMsg.removeFromCart.nullProductId);
        const sql = `DELETE FROM cart_details WHERE user_id = ${userId} AND product_id = ${productId}`;
        const [rows] = yield dbV2_1.default.query(sql);
        return apiResponse.successResponse(res, cartResponseMsg.removeFromCart.successMsg, null);
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.removeFromCart = removeFromCart;
// ====================================================================================================
// ====================================================================================================
const updateCartQty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        var productId = req.body.productId;
        const qty = req.body.qty;
        if (qty < 1)
            return apiResponse.errorMessage(res, 400, cartResponseMsg.updateCartQty.zeroQtyMsg);
        const sql = `UPDATE cart_details SET qty = ? WHERE user_id = ? AND product_id = ?`;
        const VALUES = [qty, userId, productId];
        const [rows] = yield dbV2_1.default.query(sql, VALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, cartResponseMsg.updateCartQty.successMsg, null);
        }
        else {
            return apiResponse.errorMessage(res, 400, cartResponseMsg.updateCartQty.failedMsg);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.updateCartQty = updateCartQty;
// ====================================================================================================
// ====================================================================================================
const addCostmizeCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        // const { productId, name, designation, logo, qty } = req.body;
        const customizeCard = req.body.customizeCard;
        const createdAt = utility.dateWithFormat();
        let sql = `INSERT INTO user_customize_card(user_id, product_id, name, designation, qty, image, created_at) VALUES `;
        let result;
        for (const element of customizeCard) {
            const productId = element.productId;
            const name = element.name;
            const designation = element.designation;
            const logo = element.logo;
            const qty = element.qty;
            sql = sql + `(${userId}, ${productId}, '${name}', '${designation}', ${qty}, '${logo}'  '${createdAt}'),`;
            result = sql.substring(0, sql.lastIndexOf(','));
        }
        const [rows] = yield dbV2_1.default.query(result);
        const customize_id = rows.insertId;
        // const addLogoQuery = `INSERT INTO customize_card_files(customize_id, type, file_name) VALUES (?, ?, ?)`;
        // const fileVALUES = [customize_id, "cusfile", logo];
        // const [data]:any = await pool.query(addLogoQuery, fileVALUES);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, cartResponseMsg.addCostmizeCard.successMsg, null);
        }
        else {
            return apiResponse.errorMessage(res, 400, cartResponseMsg.addCostmizeCard.failedMsg);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.addCostmizeCard = addCostmizeCard;
// ====================================================================================================
// ====================================================================================================
