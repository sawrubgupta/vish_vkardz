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
exports.privateUserProfileValidation = exports.bookAppointmentValidation = exports.customUserInfoValidation = exports.deleteVideosValidation = exports.videosValidation = exports.validatePinValidation = exports.captureLeadtValidation = exports.exchangeContactValidation = exports.enquiryValidation = exports.contactUsValidation = exports.updatePackageValidation = exports.primaryProfileValidation = exports.productRatingValidation = exports.businessHourValidation = exports.setProfilePinValidation = exports.purchaseValidation = exports.userProductsValidation = exports.aboutUsValidation = exports.redeemCouponCodeValidation = exports.updateDdeliveryAddressValidation = exports.deliveryAddressValidation = exports.customizeCardValidation = exports.cartValidation = exports.addVcfValidation = exports.switchAccountValidation = exports.editSocialLinksValidation = exports.updateVcardinfoValidation = exports.updateProfileValidation = exports.settingValidation = exports.changePasswordValidation = exports.socialLoginValidation = exports.loginValidation = exports.socialRegistrationValidation = exports.registrationValidation = void 0;
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
const socialRegistrationValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        name: joi_1.default.string().trim().min(3).max(70).trim().required(),
        type: joi_1.default.string().trim().required(),
        socialId: joi_1.default.string().trim().allow(null).allow(''),
        email: joi_1.default.string().email().max(80).required(),
        password: joi_1.default.string().min(3).max(30).required().allow(null).allow(''),
        username: joi_1.default.string().trim().min(2).max(50).required(),
        country: joi_1.default.number().integer().required(),
        phone: joi_1.default.string().trim().min(8).max(20).trim().required(),
        countryName: joi_1.default.string().trim().allow(''),
        dial_code: joi_1.default.string().required(),
        fcmToken: joi_1.default.string().trim().required(),
        deviceId: joi_1.default.allow('').allow(null),
        deviceType: joi_1.default.string().allow('').allow(null),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.socialRegistrationValidation = socialRegistrationValidation;
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
const socialLoginValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        password: joi_1.default.string().min(3).max(30).allow('').allow(null),
        email: joi_1.default.string().required().allow('').allow(null),
        fcmToken: joi_1.default.string().trim().required(),
        type: joi_1.default.string().trim().required(),
        socialId: joi_1.default.string().trim().allow(null).allow(''),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.socialLoginValidation = socialLoginValidation;
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
const updateProfileValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        name: joi_1.default.string().trim().min(3).max(80).trim().required(),
        designation: joi_1.default.string().min(3).max(80).allow(''),
        companyName: joi_1.default.string().trim().min(3).max(80).allow(''),
        dialCode: joi_1.default.string().required(),
        phone: joi_1.default.string().trim().min(8).max(20).trim().required(),
        email: joi_1.default.string().email().max(60).required(),
        website: joi_1.default.string().trim().max(80).min(5).allow(''),
        address: joi_1.default.string().normalize().max(200).required(),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.updateProfileValidation = updateProfileValidation;
// ====================================================================================================
// ====================================================================================================
const updateVcardinfoValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(3).max(80).required(),
        dialCode: joi_1.default.string().required(),
        phone: joi_1.default.string().trim().min(8).max(20).trim().required(),
        email: joi_1.default.string().email().trim().max(60).required(),
        country: joi_1.default.number().allow(''),
        countryName: joi_1.default.string().allow('').allow(null),
        gender: joi_1.default.string().max(200).allow(''),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.updateVcardinfoValidation = updateVcardinfoValidation;
// ====================================================================================================
// ====================================================================================================
const editSocialLinksValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        siteId: joi_1.default.number().integer().required(),
        siteValue: joi_1.default.string().max(100).allow(''),
        orders: joi_1.default.number().integer(),
        siteLabel: joi_1.default.string().max(20).allow('')
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.editSocialLinksValidation = editSocialLinksValidation;
// ====================================================================================================
// ====================================================================================================
const switchAccountValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        isPrivate: joi_1.default.boolean().allow(0, 1).required(),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.switchAccountValidation = switchAccountValidation;
// ====================================================================================================
// ====================================================================================================
const addVcfValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        type: joi_1.default.string().allow('').allow(null),
        userId: joi_1.default.number().allow('').allow(null),
        vcfData: joi_1.default.array().items(joi_1.default.object({
            vcfId: joi_1.default.number().allow('').allow(null),
            vcfType: joi_1.default.string().required(),
            vcfValue: joi_1.default.string().required(),
            status: joi_1.default.boolean().allow(0, 1),
        }))
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.addVcfValidation = addVcfValidation;
// ====================================================================================================
// ====================================================================================================
/*
export const affiliateRegValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    

  const schema = Joi.object({
    legalName: Joi.string().trim().min(3).max(70).required(),

    country: Joi.number().integer().required(),

    phoneNumber: Joi.string().min(8).max(20).required(),

    formOfPayment: Joi.string().trim().required(),

    country_name: Joi.string().trim().required(),

    email: Joi.string()
      .email( )
      .required(),
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
  export const submitReportValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
 
  
    const schema = Joi.object({
        allowReport: Joi.boolean(),
      phone: Joi.string().min(8).max(20),
      email: Joi.string().min(5).max(80).email(),
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
            return await apiResponse.errorMessage(res,400, errMsg);\
        }
        next();
    }
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
        currencyCode: joi_1.default.string().allow(null).allow(''),
        name: joi_1.default.string().trim().max(70).trim().required(),
        addressType: joi_1.default.string().required(),
        email: joi_1.default.string().email().trim().allow('').allow(null),
        phone: joi_1.default.string().trim().min(8).max(20).trim().required(),
        address: joi_1.default.string().normalize().max(200).required(),
        locality: joi_1.default.string().normalize().max(100).required(),
        city: joi_1.default.string().required(),
        state: joi_1.default.string().required(),
        pincode: joi_1.default.required(),
        country: joi_1.default.allow('').allow(null),
        country_name: joi_1.default.string().allow('').allow(null),
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
const updateDdeliveryAddressValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        currencyCode: joi_1.default.string().allow(null).allow(''),
        addressId: joi_1.default.number().integer().required(),
        name: joi_1.default.string().trim().max(70).trim().required(),
        addressType: joi_1.default.string().required(),
        email: joi_1.default.string().email().trim().allow('').allow(null),
        phone: joi_1.default.string().trim().min(8).max(20).trim().required(),
        address: joi_1.default.string().normalize().max(200).required(),
        locality: joi_1.default.string().normalize().max(100).required(),
        city: joi_1.default.string().required(),
        state: joi_1.default.string().required(),
        pincode: joi_1.default.required(),
        country: joi_1.default.allow('').allow(null),
        country_name: joi_1.default.string().allow('').allow(null),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.updateDdeliveryAddressValidation = updateDdeliveryAddressValidation;
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
const aboutUsValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        companyName: joi_1.default.string().trim().required(),
        year: joi_1.default.string().required(),
        business: joi_1.default.string().allow("").allow(null),
        aboutUsDetail: joi_1.default.string().allow("").allow(null),
        image: joi_1.default.string().trim().allow(''),
        document: joi_1.default.string().allow('').allow(null),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.aboutUsValidation = aboutUsValidation;
// ====================================================================================================
// ====================================================================================================
const userProductsValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        title: joi_1.default.string().max(50).required(),
        description: joi_1.default.string().min(1).max(80).trim().required(),
        price: joi_1.default.string().required(),
        image: joi_1.default.string().required(),
        currencyCode: joi_1.default.string().allow('').allow(null),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.userProductsValidation = userProductsValidation;
// ====================================================================================================
// ====================================================================================================
const purchaseValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        orderType: joi_1.default.string().min(3).max(10).required(),
        coinReedem: joi_1.default.boolean().required().allow(0, 1),
        reedemCoins: {
            coins: joi_1.default.number().min(200).allow(null).allow('').optional(),
        },
        isGiftEnable: joi_1.default.boolean().required().allow(0, 1),
        giftMessage: joi_1.default.string().required().max(200).allow(null).allow(''),
        deliveryDetails: {
            name: joi_1.default.string().trim().min(3).max(80).required(),
            phoneNumber: joi_1.default.string().trim().min(8).max(20).required(),
            secondaryPhoneNumber: joi_1.default.string().trim().min(8).max(20).allow(''),
            email: joi_1.default.string().email().max(80).required(),
            country: joi_1.default.string().trim().required(),
            locality: joi_1.default.string().normalize().max(50).required(),
            address: joi_1.default.string().normalize().max(200).required(),
            pincode: joi_1.default.number().min(999).max(9999999).required(),
            company: joi_1.default.string().allow(null).allow('').optional(),
            city: joi_1.default.string().allow(null).allow('').optional(),
            vat_number: joi_1.default.string().allow(null).allow('').optional(),
        },
        /* designSelection: {
            designType: Joi.string().min(3).max(15).required(),
            data:{
                firstName: Joi.string().min(3).max(40).allow(''),
                lastName: Joi.string().min(3).max(40).allow(''),
                companyName: Joi.string().min(3).max(80).allow(''),
                designation: Joi.string().min(3).max(80).allow(''),
                tagline: Joi.string().min(3).max(120).allow(''),
                qrCode: Joi.boolean(),
                companyLogo: Joi.string().min(3).max(300).allow(''),
                email: Joi.string().email( ).max(80).allow(''),
                phone: Joi.string().trim().min(8).max(20).allow(''),
                website: Joi.string().trim().max(80).min(5).allow(''),
            }
        },*/
        paymentInfo: {
            username: joi_1.default.string().trim().max(50).allow(''),
            email: joi_1.default.string().email().max(80).allow(''),
            deliveryCharge: joi_1.default.number(),
            // packageId: Joi.number().integer().required(),
            // codCharge: Joi.number(),
            // designCharge: Joi.number(),
            price_currency_code: joi_1.default.string().min(1).max(81).required(),
            price: joi_1.default.number().required(),
            paymentType: joi_1.default.string().min(3).max(150).allow(''),
            txnId: joi_1.default.string().allow('').allow(null),
            status: joi_1.default.string().min(1).max(2500),
            note: joi_1.default.string().allow('').allow(null),
            couponDiscount: joi_1.default.number().allow(null),
            gstAmount: joi_1.default.number().allow(null),
        },
        orderlist: joi_1.default.array()
            .items({
            product_id: joi_1.default.number(),
            qty: joi_1.default.number(),
            sub_total: joi_1.default.string(),
            isCustomizable: joi_1.default.number().integer().required(),
            customizeName: joi_1.default.string().allow(null).allow(''),
            customizeDesignation: joi_1.default.string().allow(null).allow(''),
            customzeLogo: joi_1.default.string().allow(null).allow(''),
            customizeQty: joi_1.default.number().allow(null).allow(''),
            otherInfo: joi_1.default.string().allow('').allow(null)
        })
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.purchaseValidation = purchaseValidation;
// ====================================================================================================
// ====================================================================================================
const setProfilePinValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        isPasswordEnable: joi_1.default.boolean().allow(0, 1).required(),
        securityPin: joi_1.default.number().integer().min(1).required(),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.setProfilePinValidation = setProfilePinValidation;
// ====================================================================================================
// ====================================================================================================
const businessHourValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        businessHours: joi_1.default.array().max(7).items(joi_1.default.object({
            days: joi_1.default.number().required(),
            startTime: joi_1.default.string().required(),
            endTime: joi_1.default.string().required(),
            status: joi_1.default.number().required(),
        }))
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.businessHourValidation = businessHourValidation;
// ====================================================================================================
// ====================================================================================================
const productRatingValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        productId: joi_1.default.number().required(),
        rating: joi_1.default.number().required(),
        message: joi_1.default.string().allow('').allow(null)
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.productRatingValidation = productRatingValidation;
// ====================================================================================================
// ====================================================================================================
const primaryProfileValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        primaryProfileSlug: joi_1.default.string().required(),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.primaryProfileValidation = primaryProfileValidation;
// ====================================================================================================
// ====================================================================================================
const updatePackageValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        txnId: joi_1.default.string().required(),
        priceCurrencyCode: joi_1.default.string().required(),
        price: joi_1.default.number().required(),
        paymentType: joi_1.default.string().required(),
        status: joi_1.default.string().required()
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.updatePackageValidation = updatePackageValidation;
// ====================================================================================================
// ====================================================================================================
const contactUsValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        subject: joi_1.default.string().allow('').allow(null),
        message: joi_1.default.string().required(),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.contactUsValidation = contactUsValidation;
// ====================================================================================================
// ====================================================================================================
const enquiryValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        username: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        phone: joi_1.default.required(),
        message: joi_1.default.string().allow(null, ""),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.enquiryValidation = enquiryValidation;
// ====================================================================================================
// ====================================================================================================
const exchangeContactValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        username: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        phone: joi_1.default.required(),
        message: joi_1.default.string().allow(null, ""),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.exchangeContactValidation = exchangeContactValidation;
// ====================================================================================================
// ====================================================================================================
const captureLeadtValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        username: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        phone: joi_1.default.required(),
        message: joi_1.default.string().allow(null, ""),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.captureLeadtValidation = captureLeadtValidation;
// ====================================================================================================
// ====================================================================================================
const validatePinValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        username: joi_1.default.string().required(),
        pin: joi_1.default.string().required(),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.validatePinValidation = validatePinValidation;
// ====================================================================================================
// ====================================================================================================
const videosValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        profileId: joi_1.default.number().required(),
        videoType: joi_1.default.string().required(),
        url: joi_1.default.string().required(),
        thumbnail: joi_1.default.string().allow("", null)
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.videosValidation = videosValidation;
// ====================================================================================================
// ====================================================================================================
const deleteVideosValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        profileId: joi_1.default.number().required(),
        videoId: joi_1.default.number().required(),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.deleteVideosValidation = deleteVideosValidation;
// ====================================================================================================
// ====================================================================================================
const customUserInfoValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        type: joi_1.default.string().allow("", null),
        userId: joi_1.default.allow(null, ''),
        profileId: joi_1.default.number().required(),
        vcfType: joi_1.default.string().required(),
        vcfValue: joi_1.default.string().required(),
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.customUserInfoValidation = customUserInfoValidation;
// ====================================================================================================
// ====================================================================================================
const bookAppointmentValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        type: joi_1.default.string().allow("", null),
        userId: joi_1.default.number().allow("", null),
        name: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        date: joi_1.default.string().required(),
        time: joi_1.default.string().required()
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.bookAppointmentValidation = bookAppointmentValidation;
// ====================================================================================================
// ====================================================================================================
const privateUserProfileValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        profileId: joi_1.default.number().required(),
        isPrivate: joi_1.default.boolean().allow(0, 1).required()
    });
    const value = schema.validate(req.body);
    if (value.error) {
        const errMsg = yield validationCheck(value);
        return yield apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
});
exports.privateUserProfileValidation = privateUserProfileValidation;
// ====================================================================================================
// ====================================================================================================
