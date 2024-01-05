import { NextFunction, Request, Response } from "express";
import * as apiResponse from '../helper/apiResponse'
import Joi from "joi";
import config from '../config/development';

async function validationCheck(value: any) {
    let msg = value.error.details[0].message;
    console.log(msg);

    msg = msg.replace(/"/g, "");
    msg = msg.replace('_', " ");
    msg = msg.replace('.', " ");

    const errorMessage = "Validation error : " + msg;
    return errorMessage;
}

export const registrationValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().trim().min(3).max(70).trim().required(),
        email: Joi.string().email().max(80).required(),
        password: Joi.string().min(3).max(30).required(),
        username: Joi.string().trim().min(2).max(50).required(),
        country: Joi.number().integer(),
        phone: Joi.string().trim().min(8).max(20).trim().required(),
        country_name: Joi.string().trim().allow(''),
        dial_code: Joi.string().required(),
        fcmToken: Joi.string().trim().required(),
    });

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
};

// ====================================================================================================
// ====================================================================================================

export const socialRegistrationValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        name: Joi.string().trim().allow(null, ""),
        type: Joi.string().trim().required(),
        socialId: Joi.string().trim().allow(null).allow(''),
        email: Joi.string().email().max(80).required(),
        password: Joi.string().min(3).max(30).required().allow(null).allow(''),
        username: Joi.string().allow(null, ""),
        country: Joi.number().integer().required(),
        phone: Joi.string().allow(null, ""),
        countryName: Joi.string().trim().allow(''),
        dial_code: Joi.string().allow(null, ""),
        refer_code: Joi.string().allow('').allow(null),
        fcmToken: Joi.string().allow('').allow(null),
        deviceId: Joi.allow('').allow(null),
        deviceType: Joi.string().allow('').allow(null),
    });

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
};

// ====================================================================================================
// ====================================================================================================

export const loginValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        password: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        fcmToken: Joi.string().trim().required(),
    });

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
};

// ====================================================================================================
// ====================================================================================================

export const socialLoginValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        password: Joi.string().min(3).max(30).allow('').allow(null),
        email: Joi.string().required().allow('').allow(null),
        fcmToken: Joi.string().allow('').allow(null),
        type: Joi.string().trim().required(),
        socialId: Joi.string().trim().allow(null).allow(''),
    });

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
};

// ====================================================================================================
// ====================================================================================================

export const changePasswordValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        oldPassword: Joi.string().min(3).max(30).required(),
        newPassword: Joi.string().min(3).max(30).required(),
    });

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
};

// ====================================================================================================
// ====================================================================================================

export const settingValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        pushNotificationEnable: Joi.boolean().allow(0, 1),
        emailNotificationEnable: Joi.boolean().allow(0, 1),
        currencyCode: Joi.string().min(1).max(4).allow(''),
        languageSelection: Joi.string().min(1).max(50).allow('')
    });

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
};

// ====================================================================================================
// ====================================================================================================

export const updateProfileValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        name: Joi.string().trim().min(3).max(80).trim().required(),
        designation: Joi.string().min(3).max(80).allow(''),
        companyName: Joi.string().trim().min(3).max(80).allow(''),
        dialCode: Joi.string().required(),
        phone: Joi.string().trim().min(8).max(20).trim().required(),
        email: Joi.string().email().max(60).required(),
        website: Joi.string().trim().max(80).min(5).allow(''),
        address: Joi.string().normalize().max(200).required(),
    });

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
};

// ====================================================================================================
// ====================================================================================================

export const updateVcardinfoValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        name: Joi.string().min(3).max(80).required(),
        dialCode: Joi.string().required(),
        phone: Joi.string().trim().min(8).max(20).trim().required(),
        email: Joi.string().email().trim().max(60).required(),
        country: Joi.number().allow(''),
        countryName: Joi.string().allow('').allow(null),
        gender: Joi.string().max(200).allow(''),
        image: Joi.string().allow("", null)
    });

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
};

// ====================================================================================================
// ====================================================================================================

export const editSocialLinksValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        type: Joi.string().allow("").allow(null),
        userId: Joi.allow("").allow(null),
        userSocialId: Joi.number().required(),
        profileId: Joi.number().required(),
        siteId: Joi.number().integer().required(),
        siteValue: Joi.string().max(100).allow(''),
        orders: Joi.number().integer(),
        siteLabel: Joi.string().max(20).allow('')
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================

export const switchAccountValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        isPrivate: Joi.boolean().allow(0, 1).required(),
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================

export const addVcfValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        type: Joi.string().allow('').allow(null),
        userId: Joi.number().allow('').allow(null),
        profileId: Joi.number().required(),
        vcfData: Joi.array().items(
            Joi.object({
                vcfId: Joi.number().allow('').allow(null),
                icon: Joi.string().allow('', null),
                name: Joi.string().allow('', null),
                vcfType: Joi.string().required(),
                vcfValue: Joi.string().required(),
                status: Joi.boolean().allow(0, 1),
            })
        )
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

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

export const cartValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        productId: Joi.number().required(),
        qty: Joi.number().required(),
    });

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
};

// ====================================================================================================
// ====================================================================================================

export const customizeCardValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        productId: Joi.number().required(),
        name: Joi.string().trim().max(70).trim().required(),
        designation: Joi.string().allow('').allow(null),
        qty: Joi.number().required(),
        logo: Joi.string().allow('').allow(null),
    });

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
};

// ====================================================================================================
// ====================================================================================================

export const deliveryAddressValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        currencyCode: Joi.string().allow(null).allow(''),
        name: Joi.string().trim().max(70).trim().required(),
        addressType: Joi.string().required(),
        email: Joi.string().email().trim().allow('').allow(null),
        phone: Joi.string().trim().min(8).max(20).trim().required(),
        address: Joi.string().normalize().max(200).required(),
        locality: Joi.string().normalize().max(100).required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        pincode: Joi.string().min(3).max(8).required(),
        country: Joi.allow('').allow(null),
        isDefault: Joi.number().allow("", null),
        country_name: Joi.string().allow('').allow(null),
    });

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
};

// ====================================================================================================
// ====================================================================================================

export const updateDdeliveryAddressValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        currencyCode: Joi.string().allow(null).allow(''),
        addressId: Joi.number().integer().required(),
        name: Joi.string().trim().max(70).trim().required(),
        addressType: Joi.string().required(),
        email: Joi.string().email().trim().allow('').allow(null),
        phone: Joi.string().trim().min(8).max(20).trim().required(),
        address: Joi.string().normalize().max(200).required(),
        locality: Joi.string().normalize().max(100).required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        pincode: Joi.string().min(3).max(8).required(),
        country: Joi.allow('').allow(null),
        country_name: Joi.string().allow('').allow(null),
    });

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
};

// ====================================================================================================
// ====================================================================================================

export const redeemCouponCodeValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        couponCode: Joi.string().trim().required(),
        totalDiscount: Joi.number().required(),
    });

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
};

// ====================================================================================================
// ====================================================================================================

export const aboutUsValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        type: Joi.string().allow("").allow(null),
        userId: Joi.allow("").allow(null),
        profileId: Joi.number().required(),
        companyName: Joi.string().trim().required(),
        year: Joi.string().required(),
        business: Joi.string().allow("").allow(null),
        aboutUsDetail: Joi.string().allow("").allow(null),
        image: Joi.string().trim().allow(''),
        coverImage: Joi.string().trim().allow(''),
        document: Joi.string().allow('').allow(null),
    });

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
};

// ====================================================================================================
// ====================================================================================================

export const userProductsValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        type: Joi.string().allow("").allow(null),
        userId: Joi.allow("").allow(null),
        profileId: Joi.number().required(),
        productId: Joi.number().allow("").allow(null),
        title: Joi.string().max(50).required(),
        description: Joi.string().min(1).max(3000).trim().required(),
        price: Joi.string().required(),
        image: Joi.string().required(),
        currencyCode: Joi.string().allow('').allow(null),
    });

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
};

// ====================================================================================================
// ====================================================================================================

export const purchaseValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        orderType: Joi.string().min(3).max(10).required(),
        coinReedem: Joi.boolean().required().allow(0, 1),
        reedemCoins: {
            coins: Joi.number().min(200).allow(null).allow('').optional(),
        },
        isGiftEnable: Joi.boolean().required().allow(0, 1),
        giftMessage: Joi.string().required().max(200).allow(null).allow(''),
        deliveryDetails: {
            name: Joi.string().trim().min(3).max(80).required(),
            phoneNumber: Joi.string().trim().min(8).max(20).required(),
            secondaryPhoneNumber: Joi.string().trim().min(8).max(20).allow(''),
            email: Joi.string().email().max(80).required(),
            country: Joi.string().trim().required(),
            locality: Joi.string().normalize().max(50).required(),
            address: Joi.string().normalize().max(200).required(),
            pincode: Joi.number().min(999).max(9999999).required(),
            company: Joi.string().allow(null).allow('').optional(),
            city: Joi.string().allow(null).allow('').optional(),
            vat_number: Joi.string().allow(null).allow('').optional(),
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
            username: Joi.string().trim().max(50).allow(''),
            email: Joi.string().email().max(80).allow(''),
            deliveryCharge: Joi.number(),
            // packageId: Joi.number().integer().required(),
            // codCharge: Joi.number(),
            // designCharge: Joi.number(),
            price_currency_code: Joi.string().min(1).max(81).required(),
            price: Joi.number().required(),
            paymentType: Joi.string().min(3).max(150).allow(''),
            txnId: Joi.string().allow('').allow(null),
            status: Joi.string().min(1).max(2500),
            note: Joi.string().allow('').allow(null),
            couponDiscount: Joi.number().allow(null),
            gstAmount: Joi.number().allow(null),
        },
        orderlist: Joi.array()
            .items({
                product_id: Joi.number(),
                qty: Joi.number(),
                sub_total: Joi.string(),
                isCustomizable: Joi.number().integer().required(),
                customizeName: Joi.string().allow(null).allow(''),
                customizeDesignation: Joi.string().allow(null).allow(''),
                customzeLogo: Joi.string().allow(null).allow(''),
                customizeQty: Joi.number().allow(null).allow(''),
                otherInfo: Joi.string().allow('').allow(null)

            })
    });

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
};

// ====================================================================================================
// ====================================================================================================

export const setProfilePinValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        type: Joi.string().allow("", null),
        userId: Joi.allow(null, ''),
        profileId: Joi.number().required(),
        securityPin: Joi.number().integer().min(1).required(),
    });

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
};

// ====================================================================================================
// ====================================================================================================

export const businessHourValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        type: Joi.string().allow("", null),
        userId: Joi.allow(null, ''),
        profileId: Joi.number().required(),
        businessHours: Joi.array().max(7).items(
            Joi.object({
                days: Joi.number().required(),
                startTime: Joi.string().required(),
                endTime: Joi.string().required(),
                status: Joi.number().required(),
            })
        )
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================

export const productRatingValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        productId: Joi.number().required(),
        rating: Joi.number().required(),
        message: Joi.string().allow('').allow(null)
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================

export const primaryProfileValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        primaryProfileSlug: Joi.string().required(),
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================

export const addPrimaryLinkValidation = async(req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        type: Joi.string().allow("", null),
        userId: Joi.allow(null, ''),
        profileId: Joi.number().required(),
        primaryProfileLink: Joi.string().allow("", null)
    })

    const value = schema.validate(req.body);
    
    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res,400, errMsg);
    }
    next();
}
// ====================================================================================================
// ====================================================================================================

export const oldUpdatePackageValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        txnId: Joi.string().required(),
        priceCurrencyCode: Joi.string().required(),
        price: Joi.number().required(),
        paymentType: Joi.string().required(),
        status: Joi.string().required()
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================

export const contactUsValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        subject: Joi.string().allow('').allow(null),
        message: Joi.string().required(),
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================

export const enquiryValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        username: Joi.string().required(),
        profileId: Joi.number().required(),
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.required(),
        message: Joi.string().allow(null, ""),
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================

export const exchangeContactValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        username: Joi.string().required(),
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.required(),
        message: Joi.string().allow(null, ""),
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================

export const captureLeadtValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        username: Joi.string().required(),
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.required(),
        message: Joi.string().allow(null, ""),
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================

export const validatePinValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        username: Joi.string().required(),
        pin: Joi.string().required(),
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================

export const videosValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        profileId: Joi.number().required(),
        videoType: Joi.string().required(),
        url: Joi.string().required(),
        thumbnail: Joi.string().allow("", null)
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================

export const deleteVideosValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        profileId: Joi.number().required(),
        videoId: Joi.number().required(),
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================

export const customUserInfoValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        type: Joi.string().allow("", null),
        userId: Joi.allow(null, ''),
        profileId: Joi.number().required(),
        vcfType: Joi.string().required(),
        vcfValue: Joi.string().required(),
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================

export const bookAppointmentValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        type: Joi.string().allow("", null),
        userId: Joi.number().allow("", null),
        profileId: Joi.number().required(),
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        date: Joi.string().required(),
        time: Joi.string().required()
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================

export const privateUserProfileValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        profileId: Joi.number().required(),
        isPrivate: Joi.boolean().allow(0, 1).required()
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================

export const manageAppointmentValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        type: Joi.string().allow("").allow(null),
        userId: Joi.allow("").allow(null),
        profileId: Joi.number().allow("").allow(null),
        appointmentId: Joi.number().required(),
        status: Joi.string().required()
    });

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
};

// ====================================================================================================
// ====================================================================================================

export const updateFeaturesValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        type: Joi.string().allow('').allow(null),
        userId: Joi.number().allow('').allow(null),
        profileId: Joi.number().required(),
        features: Joi.array().items(
            Joi.object({
                featureId: Joi.number().required(),
                status: Joi.boolean().allow(0, 1),
            })
        )
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================

export const vcardLayoutValidation = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        type: Joi.string().allow("").allow(null),
        userId: Joi.allow("").allow(null),
        profileId: Joi.number().required(),
        profileColor: Joi.string().required(),
        styleId: Joi.required()
    });

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
};

// ====================================================================================================
// ====================================================================================================

export const activateCardValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        type: Joi.string().allow("").allow(null),
        userId: Joi.allow("").allow(null),
        profileId: Joi.number().required(),
        productType: Joi.string().allow(null, ""),
        code: Joi.required()
    });

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================

export const updatePackageValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        txnId: Joi.string().required(), 
        priceCurrencyCode: Joi.string().required(), 
        paymentType: Joi.string().required(), 
        // packageId: Joi.number().required(),
        packageSlug: Joi.string().allow('', null), 
        price: Joi.number().required(), 
        status: Joi.required(), 
        packageType: Joi.string().required(), 
        couponDiscount: Joi.required(), 
        gstAmount: Joi.number().required(), 
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================

export const addProfileValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        themeName: Joi.string().allow(null, ""),
        type: Joi.string().allow(null,''), 
        userId: Joi.number().allow(null, ''), 
        latitude: Joi.string().allow('', null),
        longitude: Joi.string().allow('', null),
        details: Joi.array().items(
            Joi.object({
                // type: Joi.string().allow(`${config.vcfName}`).required(),
                type: Joi.string().required(),
                value: Joi.string().allow("").allow(null),
            })
        )
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================

export const updateUserProfileValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        profileId: Joi.number().required(),
        themeName: Joi.string().allow(null, ""),
        type: Joi.string().allow(null,''), 
        userId: Joi.number().allow(null, ''), 
        latitude: Joi.string().allow('', null),
        longitude: Joi.string().allow('', null),
        vcfInfo: Joi.array().items(
            Joi.object({
                vcfId: Joi.number().allow("", null),
                type: Joi.string().required(),
                value: Joi.string().allow("").allow(null),
            })
        )
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================

export const addUpdateUserProfileValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        profileId: Joi.number().allow(null),
        themeName: Joi.string().allow(null, ""),
        type: Joi.string().allow(null,''), 
        userId: Joi.number().allow(null, ''), 
        latitude: Joi.string().allow('', null),
        longitude: Joi.string().allow('', null),
        vcfInfo: Joi.array().items(
            Joi.object({
                vcfId: Joi.number().allow("", null),
                type: Joi.string().required(),
                value: Joi.string().allow("").allow(null),
            })
        )
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================

export const addTimingValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        type: Joi.string().allow(null,''), 
        userId: Joi.number().allow(null, ''), 
        profileId: Joi.number().required(), 
        startTime: Joi.string().required(), 
        endTime: Joi.string().required()  
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================

export const updateTimingValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        type: Joi.string().allow(null,''), 
        userId: Joi.number().allow(null, ''), 
        timingId: Joi.number().required(),
        profileId: Joi.number().required(), 
        startTime: Joi.string().required(), 
        endTime: Joi.string().required()  
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================

export const removeCardValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        type: Joi.string().allow(null,''), 
        userId: Joi.number().allow(null, ''), 
        profileId: Joi.number().required(), 
        cardId: Joi.number().required(), 
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================


export const addSocialLinksValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        type: Joi.string().allow("").allow(null),
        userId: Joi.allow("").allow(null),
        profileId: Joi.number().required(),
        siteId: Joi.number().integer().required(),
        siteValue: Joi.string().max(100).allow(''),
        orders: Joi.number().integer(),
        siteLabel: Joi.string().max(20).allow('')
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================


export const addUpdateSocialLinksValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        type: Joi.string().allow("").allow(null),
        userId: Joi.allow("").allow(null),
        profileId: Joi.number().required(),
        siteId: Joi.number().integer().required(),
        siteValue: Joi.string().max(100).allow(''),
        orders: Joi.number().integer(),
        siteLabel: Joi.string().max(20).allow('')
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================

export const deleteSocialLinkValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        type: Joi.string().allow("").allow(null),
        userId: Joi.allow("").allow(null),
        profileId: Joi.number().required(),
        siteId: Joi.number().required(),
        userSocialId: Joi.number().required(),
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================

export const socialStatusValidation = async (req: Request, res: Response, next: NextFunction) => {

    const schema = Joi.object({
        type: Joi.string().allow("").allow(null),
        userId: Joi.allow("").allow(null),
        userSocialId: Joi.number().required(),
        status: Joi.boolean().allow(0, 1).required(),
    })

    const value = schema.validate(req.body);

    if (value.error) {
        const errMsg = await validationCheck(value);
        return await apiResponse.errorMessage(res, 400, errMsg);
    }
    next();
}

// ====================================================================================================
// ====================================================================================================
