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
exports.dealOfTheDay = void 0;
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const responseMsg_1 = __importDefault(require("../../config/responseMsg"));
const contactSyncResMsg = responseMsg_1.default.dashboard.deals;
const dealOfTheDay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = `SELECT products.product_id, products.name, products.sub_cat, products.slug, products.description, products.price, products.mrp_price, products.discount_percent, products.product_image, products.image_back, products.image_other, products.material, products.bg_color, products.print, products.dimention, products.weight, products.thickness, products.alt_title, product_price.usd_selling_price, product_price.usd_mrp_price, product_price.aed_selling_price, product_price.aed_mrp_price, product_price.inr_selling_price, product_price.inr_mrp_price, product_price.qar_selling_price, product_price.qar_mrp_price FROM products LEFT JOIN product_price ON products.product_id = product_price.product_id WHERE products.status = 1 and is_todays_deal = 1`;
        const [rows] = yield dbV2_1.default.query(sql);
        if (rows.length > 0) {
            let productIdsArr = [];
            for (const ele of rows) {
                let productId = ele.product_id;
                productIdsArr.push(productId);
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
            return apiResponse.successResponse(res, contactSyncResMsg.dealOfTheDay.successMsg, rows);
        }
        else {
            return apiResponse.successResponse(res, contactSyncResMsg.dealOfTheDay.noDataFoundMsg, null);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.dealOfTheDay = dealOfTheDay;
// ====================================================================================================
// ====================================================================================================
