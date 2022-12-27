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
exports.redeemCouponCodeValidation = exports.deliveryAddressValidation = exports.customizeCardValidation = exports.cartValidation = exports.submitReportValidation = exports.affiliateRegValidation = exports.settingValidation = exports.changePasswordValidation = exports.loginValidation = exports.registrationValidation = void 0;
const apiResponse = __importStar(require("../helper/apiResponse"));
const joi_1 = __importDefault(require("joi"));
function validationCheck(value) {
    return __awaiter(this, void 0, void 0, function* () {
        let msg = value.error.details[0].message;
        console.log(msg);
        msg = msg.replace(/"/g, "");
        msg = msg.replace('_', " ");
        msg = msg.replace('.', " ");
        const errorMessage = "Validation error : " + msg;
        return errorMessage;
    });
}
const registrationValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        name: joi_1.default.string().trim().min(3).max(70).trim().required(),
        email: joi_1.default.string().email().max(80).required(),
        password: joi_1.default.string().min(3).max(30).required(),
        username: joi_1.default.string().trim().min(2).max(50).required(),
        country: joi_1.default.number().integer(),
        phone: joi_1.default.string().trim().min(8).max(20).trim().required(),
        country_name: joi_1.default.string().trim().allow(''),
        dial_code: joi_1.default.string().required(),
        fcmToken: joi_1.default.string().trim().required(),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.registrationValidation = registrationValidation;
// ====================================================================================================
// ====================================================================================================
const loginValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        password: joi_1.default.string().min(3).max(30).required(),
        email: joi_1.default.string().email().required(),
        fcmToken: joi_1.default.string().trim().required(),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.loginValidation = loginValidation;
// ====================================================================================================
// ====================================================================================================
const changePasswordValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        oldPassword: joi_1.default.string().min(3).max(30).required(),
        newPassword: joi_1.default.string().min(3).max(30).required(),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.changePasswordValidation = changePasswordValidation;
// ====================================================================================================
// ====================================================================================================
const settingValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        pushNotificationEnable: joi_1.default.boolean(),
        emailNotificationEnable: joi_1.default.boolean(),
        currencyCode: joi_1.default.string().min(1).max(4).allow(''),
        languageSelection: joi_1.default.string().min(1).max(50).allow('')
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.settingValidation = settingValidation;
// ====================================================================================================
// ====================================================================================================
const affiliateRegValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        legalName: joi_1.default.string().trim().min(3).max(70).required(),
        country: joi_1.default.number().integer().required(),
        phoneNumber: joi_1.default.string().min(8).max(20).required(),
        formOfPayment: joi_1.default.string().trim().required(),
        country_name: joi_1.default.string().trim().required(),
        email: joi_1.default.string()
            .email()
            .required(),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.affiliateRegValidation = affiliateRegValidation;
// ====================================================================================================
// ====================================================================================================
const submitReportValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        allowReport: joi_1.default.boolean(),
        phone: joi_1.default.string().min(8).max(20),
        email: joi_1.default.string().min(5).max(80).email(),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.submitReportValidation = submitReportValidation;
// ====================================================================================================
// ====================================================================================================
/*
    export const updateProfileValidation = async (req: Request,res: Response,next: NextFunction) => {
 
    
        const schema = Joi.object({
            name: Joi.string().trim().min(3).max(80).trim().required(),
            username: Joi.string().trim().min(3).max(50).required(),
            country: Joi.number().integer(),
            phone: Joi.string().trim().min(8).max(20).required(),
            country_name : Joi.string().trim().required(),
            gender: Joi.string().trim().max(9).allow(''),
            email: Joi.string().email( ).max(60).required(),
            website: Joi.string().trim().max(50).allow(''),
            profile_picture : Joi.string().trim().allow(''),
            dial_code: Joi.string().required()
        });
   
        const value = schema.validate(req.body);
    
        if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res,400, errMsg);
        }
        next();
    };
*/
// ====================================================================================================
// ====================================================================================================
/*
    // qucick setup
    export const quickSetupValidation = async (req: Request,res: Response,next: NextFunction) => {
    
    
        const schema = Joi.object({
            
        select_profile: Joi.number().integer().min(1).max(3).required(),
        profile_data:{
            username: Joi.string().trim().min(3).max(50).required(),
            name: Joi.string().trim().min(3).max(80).required(),
            country: Joi.number().integer().allow(''),
            country_name : Joi.string().trim().allow(''),
            gender: Joi.string().trim().min(4).max(15).allow(''),
            profile_image: Joi.string().trim().allow(''),
            display_name: Joi.string().trim().max(80).required(),
            designation: Joi.string().trim().max(80).allow(''),
            company_name:Joi.string().trim().max(80).allow(''),
            whatsapp: Joi.string().trim(true).min(8).max(20).allow(''),
            display_phone: Joi.string().trim(true).min(8).max(20).required(),
            website: Joi.string().trim().max(80).allow(''),
            display_email : Joi.string().email( ).max(80).allow(''),
            address: Joi.string().normalize().max(200).allow(''),
            profile_color: Joi.string().max(30).allow(''),
            is_profile_shareable: Joi.boolean().required(),
            social_data: Joi.array().allow(''),
        }
        });
    
        const value = schema.validate(req.body);
    
        if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res,400, errMsg);
        }
        next();
    };
*/
// ====================================================================================================
// ====================================================================================================
/*
    export const purchaseValidation = async (req: Request,res: Response,next: NextFunction) => {

        const schema = Joi.object({
            
        orderType: Joi.string().min(3).max(10).required(),
        coinReedem: Joi.boolean().required(),
        reedemCoins:{
            coins: Joi.number().min(200).allow(null).allow('').optional(),
        },
        deliveryDetails:{
            name: Joi.string().trim().min(3).max(80).required(),
            phoneNumber: Joi.string().trim().min(8).max(20).required(),
            secondaryPhoneNumber: Joi.string().trim().min(8).max(20).allow(''),
            email : Joi.string().email().max(80).required(),
            country : Joi.string().trim().required(),
            locality: Joi.string().normalize().max(50).required(),
            address: Joi.string().normalize().max(200).required(),
            zipCode: Joi.number().min(999).max(9999999).required(),
            company: Joi.string().allow(null).allow('').optional(),
            city: Joi.string().allow(null).allow('').optional(),
            vat_number: Joi.string().allow(null).allow('').optional(),
        },
        // designSelection: {
        //     designType: Joi.string().min(3).max(15).required(),
        //     data:{
        //         firstName: Joi.string().min(3).max(40).allow(''),
        //         lastName: Joi.string().min(3).max(40).allow(''),
        //         companyName: Joi.string().min(3).max(80).allow(''),
        //         designation: Joi.string().min(3).max(80).allow(''),
        //         tagline: Joi.string().min(3).max(120).allow(''),
        //         qrCode: Joi.boolean(),
        //         companyLogo: Joi.string().min(3).max(300).allow(''),
        //         email: Joi.string().email( ).max(80).allow(''),
        //         phone: Joi.string().trim().min(8).max(20).allow(''),
        //         website: Joi.string().trim().max(80).min(5).allow(''),
        //     }
        // },
        paymentInfo:{
            username: Joi.string().trim().max(50).allow(''),
            email: Joi.string().email( ).max(80).allow(''),
            // packageId: Joi.number().integer().required(),
            deliveryCharge: Joi.number(),
            codCharge: Joi.number(),
            price_currency_code: Joi.string().min(1).max(81).required(),
            price: Joi.number().required(),
            designCharge: Joi.number(),
            paymentType: Joi.string().min(3).max(150).allow(''),
            txnId: Joi.string(),
            status: Joi.string().min(1).max(2500)
        },
        orderlist: Joi.array()
        .items({
            product_id: Joi.number(),
            qty: Joi.number(),
            sub_total: Joi.string(),
        })
        });

        const value = schema.validate(req.body);
    
        if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res,400, errMsg);
        }
        next();
    };
*/
// ====================================================================================================
// ====================================================================================================
/*
    export const updateVkardzValidation =async (req:Request, res:Response, next:NextFunction) => {

  
        
            const schema = Joi.object({
                profileImage : Joi.string().trim().optional().allow(''),
                coverImage : Joi.string().trim().optional().allow(''),
                displayName: Joi.string().trim().min(1).max(80).trim().required(),
                designation: Joi.string().trim().min(1).max(80).allow('').optional(),
                companyName: Joi.string().trim().max(80).allow('').optional(),
                whatsapp: Joi.string().trim().min(8).max(20).allow('').optional(),
                displayNumber: Joi.string().trim().min(8).max(20).allow('').optional(),
                website: Joi.string().trim().max(50).min(5).allow('').optional(),
                displayEmail: Joi.string().email( ).max(80).allow('').optional(),
                address: Joi.string().trim().max(200).normalize().allow('').optional(),
                profileColor : Joi.string().trim().max(30).allow('').optional(),
                styleId: Joi.number().required(),
                dial_code: Joi.string().required()
            });
        
            const value = schema.validate(req.body);
        
            if (value.error) {
            const errMsg = await validationCheck(value);
            return await apiResponse.errorMessage(res,400, errMsg);
            }
            next();
    }
*/
// ====================================================================================================
// ====================================================================================================
/*
    export const activateCardValidation =async (req:Request, res:Response, next:NextFunction) => {


        
            const schema = Joi.object({
                username : Joi.string().min(1).max(50).trim().required(),
                code: Joi.number().integer().required()
            });
        
            const value = schema.validate(req.body);
        
            if (value.error) {
            const errMsg = await validationCheck(value);
            return await apiResponse.errorMessage(res,400, errMsg);
            }
            next();
    }
*/
// ====================================================================================================
// ====================================================================================================
/*
    export const editSocialLinksValidation =async (req:Request, res:Response, next:NextFunction) => {


        
            const schema = Joi.object({
                social_sites:[{
                    site_id: Joi.number().integer().required(),
                    site_value: Joi.string().max(100).allow(''),
                    orders: Joi.number().integer(),
                    site_label: Joi.string().max(20).allow('')
                }
                ]
            });
        
            const value = schema.validate(req.body);
        
            if (value.error) {
            const errMsg = await validationCheck(value);
            return await apiResponse.errorMessage(res,400, errMsg);
            }
            next();
    }
*/
// ====================================================================================================
// ====================================================================================================
/*
    export const cardpurchaseValidation = async (req: Request, res: Response, next: NextFunction) =>{
        const schema = Joi.object({
            email: Joi.string().email(),
            country: Joi.string().trim().required(),
            phone_number: Joi.string().min(8).max(15).required(),
            zipcode: Joi.number().min(999).max(9999999).required(),
            name: Joi.string().trim().min(3).max(70).trim().required(),
            address:Joi.string().required(),
            city: Joi.string().required(),
            company: Joi.string().optional(),
            vat: Joi.string().optional(),
            txn_id: Joi.string(),

        });
        const value = schema.validate(req.body);
        if (value.error) {
            const errMsg = await validationCheck(value);
            return await apiResponse.errorMessage(res, 400, errMsg);
        }
        next();
    };
*/
// ====================================================================================================
// ====================================================================================================
/*
    export const userProductValidation = async (req: Request, res: Response, next: NextFunction) =>{
        const schema = Joi.object({
            title: Joi.string().required(),
            image: Joi.string().trim().optional().allow(''),
            overview: Joi.string().min(1).max(120).trim().required(),
            price: Joi.number(),
            videoLink: Joi.string().allow(null).allow(''),
            details: Joi.string().allow(null).allow(''),
        });
        const value = schema.validate(req.body);
        if (value.error) {
            const errMsg = await validationCheck(value);
            return await apiResponse.errorMessage(res, 400, errMsg);
        }
        next();
    };
*/
// ====================================================================================================
// ====================================================================================================
/*
    export const userFeedbackValidation =async (req:Request, res:Response, next:NextFunction) => {
            const schema = Joi.object({
                rating: Joi.number().integer().required(),
                recommend:  Joi.number().integer().required(),
                feedback_type: Joi.string().alphanum().max(10).required(),
                comment: Joi.string().max(300).normalize().required(),
            });
        
            const value = schema.validate(req.body);
        
            if (value.error) {
            const errMsg = await validationCheck(value);
            return await apiResponse.errorMessage(res,400, errMsg);
            }
            next();
    };
*/
// ====================================================================================================
// ====================================================================================================
/*
export const enquiryValidation = async(req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().trim().min(2).max(70).trim().required(),
        email: Joi.string().email().required(),
        phone_number: Joi.string().min(8).max(15).allow(null).allow(''),
        message: Joi.string().max(300).allow(null).allow(''),
    });

    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res,400, errMsg);
    }
    next();
}
*/
// ====================================================================================================
// ====================================================================================================
/*
export const businessHourValidation = async(req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        business_hours: Joi.array().max(7).items(
            Joi.object({
                days: Joi.number().required(),
                start_time: Joi.string().required(),
                end_time: Joi.string().required(),
                status: Joi.number().required(),
            })
            )
        })
        

    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res,400, errMsg);
    }
    next();
}
*/
// ====================================================================================================
// ====================================================================================================
/*
//not used
export const wishlistValidation = async(req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        productId: Joi.number().integer().required()
    })
    
    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res,400, errMsg);
    }
    next();
}
*/
// ====================================================================================================
// ====================================================================================================
const cartValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        productId: joi_1.default.number().required(),
        qty: joi_1.default.number().required(),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.cartValidation = cartValidation;
// ====================================================================================================
// ====================================================================================================
const customizeCardValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        productId: joi_1.default.number().required(),
        name: joi_1.default.string().trim().max(70).trim().required(),
        designation: joi_1.default.string().allow('').allow(null),
        qty: joi_1.default.number().required(),
        logo: joi_1.default.string().allow('').allow(null),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.customizeCardValidation = customizeCardValidation;
// ====================================================================================================
// ====================================================================================================
const deliveryAddressValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        name: joi_1.default.string().trim().max(70).trim().required(),
        addressType: joi_1.default.string().required(),
        phone: joi_1.default.string().trim().min(8).max(20).trim().required(),
        address: joi_1.default.string().normalize().max(200).required(),
        locality: joi_1.default.string().normalize().max(100).required(),
        city: joi_1.default.string().required(),
        state: joi_1.default.string().required(),
        pincode: joi_1.default.number().min(999).max(9999999).required(),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.deliveryAddressValidation = deliveryAddressValidation;
// ====================================================================================================
// ====================================================================================================
const redeemCouponCodeValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        couponCode: joi_1.default.string().trim().required(),
        totalDiscount: joi_1.default.number().required(),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.redeemCouponCodeValidation = redeemCouponCodeValidation;
// ====================================================================================================
// ====================================================================================================
