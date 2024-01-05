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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vcardProfile = exports.updateImage = exports.updateVcardinfo = exports.updateProfile = exports.getProfile = void 0;
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const development_1 = __importDefault(require("../../config/development"));
const responseMsg_1 = __importDefault(require("../../config/responseMsg"));
const profileResMsg = responseMsg_1.default.profile.profile;
//change required according new database
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId;
        const type = req.query.type; //type = business, user, null
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.query.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, profileResMsg.getProfile.nullUserId);
        // const getUserQuery = `SELECT username, name, email, country, country_name, dial_code, phone, gender, thumb FROM users WHERE id = ${userId} LIMIT 1`;
        const getUserQuery = `SELECT * FROM users WHERE id = ${userId} LIMIT 1`;
        const [userRows] = yield dbV2_1.default.query(getUserQuery);
        if (userRows.length > 0) {
            delete userRows[0].id;
            delete userRows[0].password;
            const getSocialSiteQuery = `SELECT social_sites.id, social_sites.name, social_sites.social_link, social_sites.social_img, social_sites.type, social_sites.status, social_sites.primary_profile, vcard_social_sites.value, vcard_social_sites.label, vcard_social_sites.orders FROM social_sites LEFT JOIN vcard_social_sites ON social_sites.id = vcard_social_sites.site_id AND vcard_social_sites.user_id = ${userId} HAVING vcard_social_sites.value IS NOT NULL ORDER BY vcard_social_sites.value DESC, vcard_social_sites.orders IS NULL ASC LIMIT 6`;
            const [socialRows] = yield dbV2_1.default.query(getSocialSiteQuery);
            const getCardQuery = `SELECT products.slug, products.product_image, products.image_back, products.image_other FROM products LEFT JOIN orderlist ON products.product_id = orderlist.product_id WHERE orderlist.user_id = ${userId}`;
            const [cardData] = yield dbV2_1.default.query(getCardQuery);
            const getThemes = `SELECT users.themes as themeId, vkard_layouts.vkard_style, vkard_layouts.image FROM users LEFT JOIN vkard_layouts ON users.vcard_layouts = vkard_layouts.id WHERE users.id = ${userId} LIMIT 1`;
            const [themeData] = yield dbV2_1.default.query(getThemes);
            const cartSql = `SELECT COUNT(id) AS totalCartItem FROM cart_details WHERE user_id = ${userId}`;
            const [cartRows] = yield dbV2_1.default.query(cartSql);
            const wishlistSql = `SELECT COUNT(id) AS totalWishlistItem FROM wishlist WHERE user_id = ${userId}`;
            const [wishlistRows] = yield dbV2_1.default.query(wishlistSql);
            userRows[0].social_sites = socialRows || [];
            userRows[0].cardData = cardData || [];
            userRows[0].activeTheme = themeData[0] || {};
            userRows[0].totalCartItem = cartRows[0].totalCartItem || 0;
            userRows[0].totalWishlistItem = wishlistRows[0].totalWishlistItem || 0;
            return apiResponse.successResponse(res, profileResMsg.getProfile.successMsg, userRows[0]);
        }
        else {
            return apiResponse.errorMessage(res, 400, profileResMsg.getProfile.noDataFoundMsg);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.getProfile = getProfile;
// ====================================================================================================
// ====================================================================================================
// old
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId: string = res.locals.jwt.userId;
        let userId;
        const type = req.body.type; //type = business, user, null
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.body.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined)
            apiResponse.errorMessage(res, 401, profileResMsg.updateProfile.nullUserId);
        const { name, designation, companyName, dialCode, phone, email, website, address } = req.body;
        // const checkUser = `SELECT * FROM users where deleted_at IS NULL AND (phone = ? || email = ?) AND id != ? LIMIT 1`;
        // const checkUserVALUES = [phone, email, userId];
        // const [rows]:any = await pool.query(checkUser, checkUserVALUES);
        // if (rows.length > 0) {
        //     const dupli = [];
        //     if(email === rows[0].email){
        //         dupli.push("email")
        //     }
        //     if(phone === rows[0].phone){
        //          dupli.push("phone")
        //      }
        //      if (dupli.length > 0) {
        //         return await apiResponse.errorMessage(res,400,`${dupli.join()} is already exist, Please change`);
        //      }
        // }
        const updateQuery = `UPDATE users SET full_name = ?, designation = ?, company_name = ?, display_dial_code = ?, display_number = ?, display_email = ?, website = ?, address = ? WHERE id = ?`;
        const VALUES = [name, designation, companyName, dialCode, phone, email, website, address, userId];
        const [data] = yield dbV2_1.default.query(updateQuery, VALUES);
        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Profile updated successfully !", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to update the user, please try again later !");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.updateProfile = updateProfile;
// ====================================================================================================
// ====================================================================================================
const updateVcardinfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId: string = res.locals.jwt.userId;
        let userId;
        const type = req.body.type; //type = business, user, null
        if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
            userId = req.body.userId;
        }
        else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined)
            return apiResponse.errorMessage(res, 401, "Please login !");
        const { name, dialCode, phone, email, country, countryName, gender, image } = req.body;
        const checkUser = `SELECT * FROM users where deleted_at IS NULL AND email = ? AND id != ? LIMIT 1`;
        const checkUserVALUES = [email, userId];
        const [rows] = yield dbV2_1.default.query(checkUser, checkUserVALUES);
        if (rows.length > 0) {
            const dupli = [];
            if (email === rows[0].email) {
                dupli.push("email");
            }
            if (phone === rows[0].phone) {
                dupli.push("phone");
            }
            if (dupli.length > 0)
                return yield apiResponse.errorMessage(res, 400, `${dupli.join()} is already exist, Please change`);
        }
        const updateQuery = `UPDATE users SET name = ?, dial_code = ?, phone = ?, email = ?, country = ?, country_name = ?, gender = ?, thumb = ? WHERE id = ?`;
        const VALUES = [name, dialCode, phone, email, country, countryName, gender, image, userId];
        const [data] = yield dbV2_1.default.query(updateQuery, VALUES);
        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Profile updated successfully !", null);
        }
        else {
            return apiResponse.errorMessage(res, 400, "Failed to update the user, please try again later !");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.updateVcardinfo = updateVcardinfo;
// ====================================================================================================
// ====================================================================================================
//according new json
const updateImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const userId: string = res.locals.jwt.userId;
    let userId;
    const type = req.body.type; //type = business, user, null
    if (type && (type === development_1.default.businessType || type === development_1.default.websiteType || type === development_1.default.vcfWebsite)) {
        userId = req.body.userId;
    }
    else {
        userId = res.locals.jwt.userId;
    }
    if (!userId || userId === "" || userId === undefined)
        return apiResponse.errorMessage(res, 401, profileResMsg.updateImage.nullUserId);
    const { profileId, profileImage, coverImage } = req.body;
    if (!profileId || profileId === null || profileId === undefined)
        return apiResponse.errorMessage(res, 400, profileResMsg.updateImage.invalidProileId);
    const sql = `UPDATE users_profile SET profile_image = ?, cover_photo = ? WHERE user_id = ? AND id = ?`;
    const VALUES = [profileImage, coverImage, userId, profileId];
    const [rows] = yield dbV2_1.default.query(sql, VALUES);
    if (rows.affectedRows > 0) {
        return apiResponse.successResponse(res, profileResMsg.updateImage.successMsg, null);
    }
    else {
        return apiResponse.errorMessage(res, 400, profileResMsg.updateImage.failedMsg);
    }
});
exports.updateImage = updateImage;
// ====================================================================================================
// ====================================================================================================
//updated profile with new json
const vcardProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c, _d, e_2, _e, _f;
    var _g, _h, _j, _k, _l, _m;
    try {
        // const username = req.query.username;
        let key = req.query.key;
        if (!key || key === null)
            return apiResponse.errorMessage(res, 400, profileResMsg.vcardProfile.notExist);
        const splitCode = key.split(development_1.default.vcardLink);
        let newCardNum = splitCode[1] || '';
        let splitNewCardNumber = newCardNum.split('/');
        let newCardNumber = splitNewCardNumber[0] || newCardNum || key;
        // console.log("newCardNumber", newCardNumber);
        let profileRows;
        const profileSql = `SELECT users_profile.* FROM users_profile LEFT JOIN user_card ON user_card.profile_id = users_profile.id WHERE users_profile.deleted_at IS NULL AND (users_profile.profile_id = ? OR users_profile.card_number = ? OR users_profile.card_number = ? OR users_profile.card_number_fix = ? OR users_profile.card_number_fix = ?) LIMIT 1`;
        // const profileSql = `SELECT users_profile.* FROM users_profile LEFT JOIN user_card ON user_card.profile_id = users_profile.id WHERE users_profile.deleted_at IS NULL AND (users_profile.profile_id = ? OR users_profile.card_number = ? OR users_profile.card_number = ? OR users_profile.card_number_fix = ? OR users_profile.card_number_fix = ?) LIMIT 1`;
        const profileVALUES = [key, key, newCardNumber, key, newCardNumber];
        [profileRows] = yield dbV2_1.default.query(profileSql, profileVALUES);
        // console.log("profileRows", profileRows);
        let userSql;
        let profileId;
        let userRows;
        let userId;
        if (profileRows.length > 0) {
            userSql = `SELECT users.id, users.username, users.type, users.referral_code, users.offer_coin, users.country, users.country_name, users.currency_code, users.device_type, business_admin.image, business_admin.company FROM users LEFT JOIN business_admin ON business_admin.id = users.admin_id WHERE users.deleted_at IS NULL AND users.id = ${profileRows[0].user_id}`;
            [userRows] = yield dbV2_1.default.query(userSql);
            // if(userRows.length === 0) return apiResponse.errorMessage(res, 404, "User not found");
            if (userRows.length === 0) {
                const checkCode = `SELECT id FROM card_activation WHERE card_number = '${key}' LIMIT 1`;
                const [codeRows] = yield dbV2_1.default.query(checkCode);
                if (codeRows.length > 0) {
                    return res.status(400).json({
                        status: false,
                        data: null,
                        code: 1002,
                        message: "Card not activated",
                    });
                }
                else {
                    return res.status(400).json({
                        status: false,
                        data: null,
                        code: 1001,
                        message: "User not found",
                    });
                }
            }
            profileId = profileRows[0].id;
        }
        else {
            userSql = `SELECT users.id, users.username, users.type, users.referral_code, users.offer_coin, users.country, users.country_name, users.currency_code, users.device_type, business_admin.image, business_admin.company FROM user_card LEFT JOIN users ON users.id = user_card.user_id LEFT JOIN business_admin ON business_admin.id = users.admin_id WHERE users.deleted_at IS NULL AND user_card.deactivated_at IS NULL AND (user_card.card_number = '${key}' OR user_card.card_number = '${newCardNumber}' OR user_card.card_number_fix = '${key}' OR user_card.card_number_fix = '${newCardNumber}') LIMIT 1`;
            // userSql = `SELECT users.id, users.username, users.type, users.referral_code, users.offer_coin, users.country, users.country_name, users.currency_code, users.device_type, business_admin.image, business_admin.company FROM user_card LEFT JOIN users ON users.id = user_card.user_id LEFT JOIN business_admin ON business_admin.id = users.admin_id WHERE users.deleted_at IS NULL AND user_card.deactivated_at IS NULL AND (users.username = '${key}' OR users.username = '${newCardNumber}' OR user_card.card_number = '${key}' OR user_card.card_number = '${newCardNumber}' OR user_card.card_number_fix = '${key}' OR user_card.card_number_fix = '${newCardNumber}') LIMIT 1`;
            [userRows] = yield dbV2_1.default.query(userSql);
            if (userRows.length > 0) {
                const userProfileSql = `SELECT * FROM users_profile WHERE user_id = ${userRows[0].id} AND is_default = 1 LIMIT 1`;
                [profileRows] = yield dbV2_1.default.query(userProfileSql);
                profileId = profileRows[0].id;
            }
            else {
                const checkCode = `SELECT id FROM card_activation WHERE card_number = '${key}' LIMIT 1`;
                const [codeRows] = yield dbV2_1.default.query(checkCode);
                if (codeRows.length > 0) {
                    return res.status(400).json({
                        status: false,
                        data: null,
                        code: 1002,
                        message: "Card not activated",
                    });
                }
                else {
                    return res.status(400).json({
                        status: false,
                        data: null,
                        code: 1001,
                        message: "User not found",
                    });
                }
                return apiResponse.errorMessage(res, 400, profileResMsg.vcardProfile.notExist);
            }
        }
        // const [userRows]:any = await pool.query(userSql);
        // console.log("userRows", userRows);
        // if (userRows.length === 0) return apiResponse.errorMessage(res, 400, "Profile not found!");
        userId = userRows[0].id;
        const checkPackageSql = `SELECT * FROM users_package WHERE user_id = ${userId} LIMIT 1`;
        const [packageRows] = yield dbV2_1.default.query(checkPackageSql);
        // const userProfileSql = `SELECT * FROM users_profile WHERE deleted_at IS NULL AND user_id = ${userId}`;
        // const [profileRows]:any = await pool.query(userProfileSql);
        const vcfInfoSql = `SELECT * FROM vcf_info WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [vcfInfoRows] = yield dbV2_1.default.query(vcfInfoSql);
        const customFieldSql = `SELECT icon, value, type FROM vcf_custom_field WHERE user_id = ${userId} AND profile_id = ${profileId} AND status = 1`;
        const [customFieldRows] = yield dbV2_1.default.query(customFieldSql);
        const productSql = `SELECT id, title, overview as description, currency_code, images, price, status FROM services WHERE user_id = ${userId} AND profile_id = ${profileId} ORDER BY created_at DESC LIMIT 5`;
        const [productRows] = yield dbV2_1.default.query(productSql);
        const gallarySql = `SELECT * FROM portfolio WHERE user_id = ${userId} AND profile_id = ${profileId} ORDER BY created_at DESC LIMIT 5`;
        const [gallareRows] = yield dbV2_1.default.query(gallarySql);
        const businessHourSql = `SELECT * FROM business_hours WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [businessHourRows] = yield dbV2_1.default.query(businessHourSql);
        const aboutSql = `SELECT id, company_name, business, year, about_detail, images, cover_image, created_at FROM about WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [aboutUsRows] = yield dbV2_1.default.query(aboutSql);
        const videoSql = `SELECT * FROM videos WHERE user_id = ${userId} AND profile_id = ${profileId} LIMIT 5`;
        const [videoRows] = yield dbV2_1.default.query(videoSql);
        const getSocialSiteQuery = `SELECT social_sites.id, social_sites.name, social_sites.social_link, social_sites.social_img, social_sites.type, vcard_social_sites.status, social_sites.social_type, social_sites.primary_profile, vcard_social_sites.value, vcard_social_sites.label, vcard_social_sites.orders FROM social_sites LEFT JOIN vcard_social_sites ON social_sites.id = vcard_social_sites.site_id AND vcard_social_sites.user_id = ${userId} AND vcard_social_sites.profile_id = ${profileId} AND vcard_social_sites.status = 1 HAVING vcard_social_sites.value IS NOT NULL ORDER BY vcard_social_sites.value DESC, vcard_social_sites.orders IS NULL ASC`;
        const [socialRows] = yield dbV2_1.default.query(getSocialSiteQuery);
        const featureSql = `SELECT users_features.feature_id, features.type, features.features, features.slug, users_features.status FROM features LEFT JOIN users_features ON features.id = users_features.feature_id WHERE users_features.user_id = ${userId} AND users_features.profile_id = ${profileId}`;
        const [featureRows] = yield dbV2_1.default.query(featureSql);
        // const getFeatureStatus = `SELECT status FROM users_features WHERE user_id = ${userId} AND profile_id = ${profileId} AND feature_id = 3 LIMIT 1`;
        let vcf = {};
        let socials = {};
        let others = {};
        let qrCodeStatus = 0;
        let appointmentFeatureStatus = 0;
        let galleryFeatureStatus = 0;
        let productFeatureStatus = 0;
        let enquiryFeatureStatus = 0;
        let businesshourFeatureStatus = 0;
        let aboutFeatureStatus = 0;
        for (const featureEle of featureRows) {
            if (featureEle.type === development_1.default.vcfType)
                vcf[featureEle.slug] = featureEle.status;
            if (featureEle.type === development_1.default.socialType)
                socials[featureEle.slug] = featureEle.status;
            if (featureEle.type === development_1.default.otherType)
                others[featureEle.slug] = featureEle.status;
            if (featureEle.slug === 'appointment')
                appointmentFeatureStatus = featureEle.status;
            if (featureEle.slug === 'portfolio')
                galleryFeatureStatus = featureEle.status;
            if (featureEle.slug === 'services')
                productFeatureStatus = featureEle.status;
            if (featureEle.slug === 'contacts')
                enquiryFeatureStatus = featureEle.status;
            if (featureEle.slug === 'business-hour')
                businesshourFeatureStatus = featureEle.status;
            if (featureEle.slug === 'about')
                aboutFeatureStatus = featureEle.status;
            if (featureEle.slug == 'qr_code')
                qrCodeStatus = featureEle.status;
            if (featureEle.slug == 'set-pin')
                vcf[featureEle.slug] = featureEle.status;
        }
        // const gender:any = (vcfInfoRows.find((x: { type: string; }) => x.type === config.vcfGender))?.value??null;
        // const designation:any = (vcfInfoRows.find((x: { type: string; }) => x.type === config.vcfDesignation))?.value??null;
        // const department:any = (vcfInfoRows.find((x: { type: string; }) => x.type === config.vcfDepartment))?.value??"";
        // const notes:any = (vcfInfoRows.find((x: { type: string; }) => x.type === config.vcfNotes))?.value??"";
        // const dob:any = (vcfInfoRows.find((x: { type: string; }) => x.type === config.vcfDesignation))?.value??"";
        // const number:any = (vcfInfoRows.find((x: { type: string; }) => x.type === config.vcfNumber))?.value??"";
        // console.log(number, "number");
        let gender = null;
        let designation = null;
        let department = null;
        let notes = null;
        let dob = null;
        let name = null;
        let phone = [];
        let email = [];
        let address = [];
        let company = [];
        let website = [];
        try {
            for (var _o = true, vcfInfoRows_1 = __asyncValues(vcfInfoRows), vcfInfoRows_1_1; vcfInfoRows_1_1 = yield vcfInfoRows_1.next(), _a = vcfInfoRows_1_1.done, !_a;) {
                _c = vcfInfoRows_1_1.value;
                _o = false;
                try {
                    const ele = _c;
                    if (ele.type === development_1.default.vcfGender)
                        gender = ele.value;
                    if (ele.type === development_1.default.vcfDesignation)
                        designation = ele.value;
                    if (ele.type === development_1.default.vcfDepartment)
                        department = ele.value;
                    if (ele.type === development_1.default.vcfNotes)
                        notes = ele.value;
                    if (ele.type === development_1.default.vcfDob)
                        dob = ele.value;
                    if (ele.type === development_1.default.vcfName)
                        name = ele.value;
                    if (ele.type === development_1.default.vcfNumber || ele.type === development_1.default.vcfPhone)
                        phone.push({ number: ele.value });
                    if (ele.type === development_1.default.vcfEmail)
                        email.push(ele.value);
                    if (ele.type === development_1.default.vcfAddress)
                        address.push(ele.value);
                    if (ele.type === development_1.default.vcfCompany)
                        company.push(ele.value);
                    if (ele.type === development_1.default.vcfWebsite)
                        website.push(ele.value);
                }
                finally {
                    _o = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_o && !_a && (_b = vcfInfoRows_1.return)) yield _b.call(vcfInfoRows_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        let socialLink = [];
        let socialContacts = [];
        let socialBusiness = [];
        let socialPayment = [];
        try {
            for (var _p = true, socialRows_1 = __asyncValues(socialRows), socialRows_1_1; socialRows_1_1 = yield socialRows_1.next(), _d = socialRows_1_1.done, !_d;) {
                _f = socialRows_1_1.value;
                _p = false;
                try {
                    const socialEle = _f;
                    if (socialEle.social_type === development_1.default.socialType)
                        socialLink.push(socialEle);
                    if (socialEle.social_type === development_1.default.contactType)
                        socialContacts.push(socialEle);
                    if (socialEle.social_type === development_1.default.businessType)
                        socialBusiness.push(socialEle);
                    if (socialEle.social_type === development_1.default.paymentType)
                        socialPayment.push(socialEle);
                }
                finally {
                    _p = true;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_p && !_d && (_e = socialRows_1.return)) yield _e.call(socialRows_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        let primaryProfileLink = profileRows[0].primary_profile_link;
        if (primaryProfileLink != null) {
            if (primaryProfileLink == `https://vkardz.com/${key}` || primaryProfileLink == `http://vkardz.com/${key}` || primaryProfileLink == `https://www.vkardz.com/${key}` || primaryProfileLink == `http://www.vkardz.com/${key}`) {
                primaryProfileLink = null;
            }
        }
        const profile_data = {
            userId: userRows[0].id,
            username: userRows[0].username,
            profileId: profileId,
            referral_code: userRows[0].referral_code,
            admin: {
                company_logo: userRows[0].image,
                company_branding: userRows[0].company,
                company_name: userRows[0].company
            },
            country: {
                country_code: userRows[0].country,
                country_name: userRows[0].country_name
            },
            name: name,
            gender: gender,
            designation: designation,
            department: department,
            notes: notes,
            dob: dob,
            number: phone,
            email: email,
            address: address,
            company_name: company,
            website: website,
            theme: {
                vcard_layouts: profileRows[0].vcard_layouts,
                vcard_bg_color: profileRows[0].vcard_bg_color,
            },
            socials: {
                social_link: socialLink,
                contact_info: socialContacts,
                business_link: socialBusiness,
                payments: socialPayment
            },
            custom: customFieldRows,
            other_info: {
                profile_image: profileRows[0].profile_image,
                cover_photo: profileRows[0].cover_photo
            },
            share: {
                profile_link: profileRows[0].primary_profile_link,
                qr_code: profileRows[0].qr_code
            },
            products: productRows,
            gallery: gallareRows,
            business_hours: businessHourRows,
            about_us: aboutUsRows,
            videos: videoRows,
            profile_setting: {
                is_card_linked: profileRows[0].is_card_linked,
                // is_expired: profileRows[0].is_expired,
                // profile_package: profileRows[0].account_type,
                // package_name: profileRows[0].package_name,
                is_expired: (_h = (_g = packageRows[0]) === null || _g === void 0 ? void 0 : _g.is_expired) !== null && _h !== void 0 ? _h : null,
                profile_package: (_k = (_j = packageRows[0]) === null || _j === void 0 ? void 0 : _j.package_id) !== null && _k !== void 0 ? _k : null,
                package_name: (_m = (_l = packageRows[0]) === null || _l === void 0 ? void 0 : _l.package_slug) !== null && _m !== void 0 ? _m : null,
                device_type: userRows[0].device_type,
                currency_code: userRows[0].currency_code,
                type: userRows[0].type,
                username: userRows[0].username,
                card_number: profileRows[0].card_number,
                card_number_fix: profileRows[0].card_number_fix,
                on_tap: {
                    type: profileRows[0].on_tap_url,
                    single_tap: "url"
                },
                pin: profileRows[0].set_password,
                is_private_mode: profileRows[0].is_private,
                // affiliator_code: "HSHS12",
                profile_theme: profileRows[0].vcard_layouts,
                profile_view: profileRows[0].hit,
                colors: {
                    font_color: profileRows[0].font,
                    theme_color: profileRows[0].vcard_bg_color,
                },
                profile_features: {
                    vcf: vcf,
                    appointment: appointmentFeatureStatus,
                    products: productFeatureStatus,
                    gallery: galleryFeatureStatus,
                    enquiry: enquiryFeatureStatus,
                    businesshour: businesshourFeatureStatus,
                    about: aboutFeatureStatus,
                    qr_code: qrCodeStatus,
                    socials: socials,
                    others: others
                },
                profile_language: profileRows[0].language,
            }
        };
        return apiResponse.successResponse(res, profileResMsg.vcardProfile.successMsg, profile_data);
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.vcardProfile = vcardProfile;
// ====================================================================================================
// ====================================================================================================
