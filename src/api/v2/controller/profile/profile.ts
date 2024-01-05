import { Request, Response } from "express";
import pool from '../../../../dbV2';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config from '../../config/development';
import resMsg from '../../config/responseMsg';

const profileResMsg = resMsg.profile.profile;

//change required according new database
export const getProfile = async (req: Request, res: Response) => {
    try {
        let userId: any;
        const type = req.query.type; //type = business, user, null
        if (type && (type === config.businessType || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, profileResMsg.getProfile.nullUserId);

        // const getUserQuery = `SELECT username, name, email, country, country_name, dial_code, phone, gender, thumb FROM users WHERE id = ${userId} LIMIT 1`;
        const getUserQuery = `SELECT * FROM users WHERE id = ${userId} LIMIT 1`;
        const [userRows]: any = await pool.query(getUserQuery);

        if (userRows.length > 0) {
            delete userRows[0].id;
            delete userRows[0].password;

            const getSocialSiteQuery = `SELECT social_sites.id, social_sites.name, social_sites.social_link, social_sites.social_img, social_sites.type, social_sites.status, social_sites.primary_profile, vcard_social_sites.value, vcard_social_sites.label, vcard_social_sites.orders FROM social_sites LEFT JOIN vcard_social_sites ON social_sites.id = vcard_social_sites.site_id AND vcard_social_sites.user_id = ${userId} HAVING vcard_social_sites.value IS NOT NULL ORDER BY vcard_social_sites.value DESC, vcard_social_sites.orders IS NULL ASC LIMIT 6`;
            const [socialRows]: any = await pool.query(getSocialSiteQuery);

            const getCardQuery = `SELECT products.slug, products.product_image, products.image_back, products.image_other FROM products LEFT JOIN orderlist ON products.product_id = orderlist.product_id WHERE orderlist.user_id = ${userId}`;
            const [cardData]: any = await pool.query(getCardQuery);

            const getThemes = `SELECT users.themes as themeId, vkard_layouts.vkard_style, vkard_layouts.image FROM users LEFT JOIN vkard_layouts ON users.vcard_layouts = vkard_layouts.id WHERE users.id = ${userId} LIMIT 1`;
            const [themeData]: any = await pool.query(getThemes);

            const cartSql = `SELECT COUNT(id) AS totalCartItem FROM cart_details WHERE user_id = ${userId}`;
            const [cartRows]: any = await pool.query(cartSql);

            const wishlistSql = `SELECT COUNT(id) AS totalWishlistItem FROM wishlist WHERE user_id = ${userId}`;
            const [wishlistRows]: any = await pool.query(wishlistSql);

            userRows[0].social_sites = socialRows || [];
            userRows[0].cardData = cardData || [];
            userRows[0].activeTheme = themeData[0] || {};
            userRows[0].totalCartItem = cartRows[0].totalCartItem || 0
            userRows[0].totalWishlistItem = wishlistRows[0].totalWishlistItem || 0

            return apiResponse.successResponse(res, profileResMsg.getProfile.successMsg, userRows[0]);
        } else {
            return apiResponse.errorMessage(res, 400, profileResMsg.getProfile.noDataFoundMsg);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

// old
export const updateProfile = async (req: Request, res: Response) => {
    try {
        // const userId: string = res.locals.jwt.userId;
        let userId: any;
        const type = req.body.type; //type = business, user, null
        if (type && (type === config.businessType || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) apiResponse.errorMessage(res, 401, profileResMsg.updateProfile.nullUserId);

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
        const [data]: any = await pool.query(updateQuery, VALUES);

        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Profile updated successfully !", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to update the user, please try again later !");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

export const updateVcardinfo = async (req: Request, res: Response) => {
    try {
        // const userId: string = res.locals.jwt.userId;
        let userId: any;
        const type = req.body.type; //type = business, user, null
        if (type && (type === config.businessType || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.body.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, "Please login !");

        const { name, dialCode, phone, email, country, countryName, gender, image } = req.body;

        const checkUser = `SELECT * FROM users where deleted_at IS NULL AND email = ? AND id != ? LIMIT 1`;
        const checkUserVALUES = [email, userId];
        const [rows]: any = await pool.query(checkUser, checkUserVALUES);

        if (rows.length > 0) {
            const dupli = [];
            if (email === rows[0].email) {
                dupli.push("email")
            }
            if (phone === rows[0].phone) {
                dupli.push("phone")
            }
            if (dupli.length > 0) return await apiResponse.errorMessage(res, 400, `${dupli.join()} is already exist, Please change`);
        }

        const updateQuery = `UPDATE users SET name = ?, dial_code = ?, phone = ?, email = ?, country = ?, country_name = ?, gender = ?, thumb = ? WHERE id = ?`;
        const VALUES = [name, dialCode, phone, email, country, countryName, gender, image, userId];
        const [data]: any = await pool.query(updateQuery, VALUES);

        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res, "Profile updated successfully !", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to update the user, please try again later !");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================

//according new json
export const updateImage = async (req: Request, res: Response) => {
    // const userId: string = res.locals.jwt.userId;
    let userId: any;
    const type = req.body.type; //type = business, user, null
    if (type && (type === config.businessType || type === config.websiteType || type === config.vcfWebsite)) {
        userId = req.body.userId;
    } else {
        userId = res.locals.jwt.userId;
    }
    if (!userId || userId === "" || userId === undefined) return apiResponse.errorMessage(res, 401, profileResMsg.updateImage.nullUserId);

    const { profileId, profileImage, coverImage } = req.body;
    if (!profileId || profileId === null || profileId === undefined) return apiResponse.errorMessage(res, 400, profileResMsg.updateImage.invalidProileId);

    const sql = `UPDATE users_profile SET profile_image = ?, cover_photo = ? WHERE user_id = ? AND id = ?`;
    const VALUES = [profileImage, coverImage, userId, profileId];
    const [rows]: any = await pool.query(sql, VALUES);

    if (rows.affectedRows > 0) {
        return apiResponse.successResponse(res, profileResMsg.updateImage.successMsg, null);
    } else {
        return apiResponse.errorMessage(res, 400, profileResMsg.updateImage.failedMsg);
    }
}

// ====================================================================================================
// ====================================================================================================


//updated profile with new json
export const vcardProfile = async (req: Request, res: Response) => {
    try {
        // const username = req.query.username;
        let key: any = req.query.key;

        if (!key || key === null) return apiResponse.errorMessage(res, 400, profileResMsg.vcardProfile.notExist);

        const splitCode = key.split(config.vcardLink);
        let newCardNum: any = splitCode[1] || '';

        let splitNewCardNumber = newCardNum.split('/');
        let newCardNumber = splitNewCardNumber[0] || newCardNum || key;
        // console.log("newCardNumber", newCardNumber);

        let profileRows: any
        const profileSql = `SELECT users_profile.* FROM users_profile LEFT JOIN user_card ON user_card.profile_id = users_profile.id WHERE users_profile.deleted_at IS NULL AND (users_profile.profile_id = ? OR users_profile.card_number = ? OR users_profile.card_number = ? OR users_profile.card_number_fix = ? OR users_profile.card_number_fix = ?) LIMIT 1`;
        // const profileSql = `SELECT users_profile.* FROM users_profile LEFT JOIN user_card ON user_card.profile_id = users_profile.id WHERE users_profile.deleted_at IS NULL AND (users_profile.profile_id = ? OR users_profile.card_number = ? OR users_profile.card_number = ? OR users_profile.card_number_fix = ? OR users_profile.card_number_fix = ?) LIMIT 1`;
        const profileVALUES = [key, key, newCardNumber, key, newCardNumber];
        [profileRows] = await pool.query(profileSql, profileVALUES);

        // console.log("profileRows", profileRows);

        let userSql: any;
        let profileId: number;
        let userRows: any;
        let userId: number;
        if (profileRows.length > 0) {
            userSql = `SELECT users.id, users.username, users.type, users.referral_code, users.offer_coin, users.country, users.country_name, users.currency_code, users.device_type, business_admin.image, business_admin.company FROM users LEFT JOIN business_admin ON business_admin.id = users.admin_id WHERE users.deleted_at IS NULL AND users.id = ${profileRows[0].user_id}`;
            [userRows] = await pool.query(userSql);
            // if(userRows.length === 0) return apiResponse.errorMessage(res, 404, "User not found");
            if (userRows.length === 0) {
                const checkCode = `SELECT id FROM card_activation WHERE card_number = '${key}' LIMIT 1`;
                const [codeRows]: any = await pool.query(checkCode);

                if (codeRows.length > 0) {
                    return res.status(400).json({
                        status: false,
                        data: null,
                        code: 1002,
                        message: "Card not activated",
                    })
                } else {
                    return res.status(400).json({
                        status: false,
                        data: null,
                        code: 1001,
                        message: "User not found",
                    })
                }
            }
            profileId = profileRows[0].id;
        } else {
            userSql = `SELECT users.id, users.username, users.type, users.referral_code, users.offer_coin, users.country, users.country_name, users.currency_code, users.device_type, business_admin.image, business_admin.company FROM user_card LEFT JOIN users ON users.id = user_card.user_id LEFT JOIN business_admin ON business_admin.id = users.admin_id WHERE users.deleted_at IS NULL AND user_card.deactivated_at IS NULL AND (user_card.card_number = '${key}' OR user_card.card_number = '${newCardNumber}' OR user_card.card_number_fix = '${key}' OR user_card.card_number_fix = '${newCardNumber}') LIMIT 1`;
            // userSql = `SELECT users.id, users.username, users.type, users.referral_code, users.offer_coin, users.country, users.country_name, users.currency_code, users.device_type, business_admin.image, business_admin.company FROM user_card LEFT JOIN users ON users.id = user_card.user_id LEFT JOIN business_admin ON business_admin.id = users.admin_id WHERE users.deleted_at IS NULL AND user_card.deactivated_at IS NULL AND (users.username = '${key}' OR users.username = '${newCardNumber}' OR user_card.card_number = '${key}' OR user_card.card_number = '${newCardNumber}' OR user_card.card_number_fix = '${key}' OR user_card.card_number_fix = '${newCardNumber}') LIMIT 1`;
            [userRows] = await pool.query(userSql);

            if (userRows.length > 0) {
                const userProfileSql = `SELECT * FROM users_profile WHERE user_id = ${userRows[0].id} AND is_default = 1 LIMIT 1`;
                [profileRows] = await pool.query(userProfileSql);
                profileId = profileRows[0].id;

            } else {
                const checkCode = `SELECT id FROM card_activation WHERE card_number = '${key}' LIMIT 1`;
                const [codeRows]: any = await pool.query(checkCode);

                if (codeRows.length > 0) {
                    return res.status(400).json({
                        status: false,
                        data: null,
                        code: 1002,
                        message: "Card not activated",
                    })
                } else {
                    return res.status(400).json({
                        status: false,
                        data: null,
                        code: 1001,
                        message: "User not found",
                    })
                }
                return apiResponse.errorMessage(res, 400, profileResMsg.vcardProfile.notExist);
            }
        }
        // const [userRows]:any = await pool.query(userSql);

        // console.log("userRows", userRows);

        // if (userRows.length === 0) return apiResponse.errorMessage(res, 400, "Profile not found!");
        userId = userRows[0].id;

        const checkPackageSql = `SELECT * FROM users_package WHERE user_id = ${userId} LIMIT 1`;
        const [packageRows]: any = await pool.query(checkPackageSql);

        // const userProfileSql = `SELECT * FROM users_profile WHERE deleted_at IS NULL AND user_id = ${userId}`;
        // const [profileRows]:any = await pool.query(userProfileSql);

        const vcfInfoSql = `SELECT * FROM vcf_info WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [vcfInfoRows]: any = await pool.query(vcfInfoSql);

        const customFieldSql = `SELECT icon, value, type FROM vcf_custom_field WHERE user_id = ${userId} AND profile_id = ${profileId} AND status = 1`;
        const [customFieldRows]: any = await pool.query(customFieldSql);

        const productSql = `SELECT id, title, overview as description, currency_code, images, price, status FROM services WHERE user_id = ${userId} AND profile_id = ${profileId} ORDER BY created_at DESC LIMIT 5`;
        const [productRows]: any = await pool.query(productSql);

        const gallarySql = `SELECT * FROM portfolio WHERE user_id = ${userId} AND profile_id = ${profileId} ORDER BY created_at DESC LIMIT 5`;
        const [gallareRows]: any = await pool.query(gallarySql);

        const businessHourSql = `SELECT * FROM business_hours WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [businessHourRows]: any = await pool.query(businessHourSql);

        const aboutSql = `SELECT id, company_name, business, year, about_detail, images, cover_image, created_at FROM about WHERE user_id = ${userId} AND profile_id = ${profileId}`;
        const [aboutUsRows]: any = await pool.query(aboutSql);

        const videoSql = `SELECT * FROM videos WHERE user_id = ${userId} AND profile_id = ${profileId} LIMIT 5`;
        const [videoRows]: any = await pool.query(videoSql);

        const getSocialSiteQuery = `SELECT social_sites.id, social_sites.name, social_sites.social_link, social_sites.social_img, social_sites.type, vcard_social_sites.status, social_sites.social_type, social_sites.primary_profile, vcard_social_sites.value, vcard_social_sites.label, vcard_social_sites.orders FROM social_sites LEFT JOIN vcard_social_sites ON social_sites.id = vcard_social_sites.site_id AND vcard_social_sites.user_id = ${userId} AND vcard_social_sites.profile_id = ${profileId} AND vcard_social_sites.status = 1 HAVING vcard_social_sites.value IS NOT NULL ORDER BY vcard_social_sites.value DESC, vcard_social_sites.orders IS NULL ASC`;
        const [socialRows]: any = await pool.query(getSocialSiteQuery);

        const featureSql = `SELECT users_features.feature_id, features.type, features.features, features.slug, users_features.status FROM features LEFT JOIN users_features ON features.id = users_features.feature_id WHERE users_features.user_id = ${userId} AND users_features.profile_id = ${profileId}`;
        const [featureRows]: any = await pool.query(featureSql);

        // const getFeatureStatus = `SELECT status FROM users_features WHERE user_id = ${userId} AND profile_id = ${profileId} AND feature_id = 3 LIMIT 1`;

        let vcf: any = {};
        let socials: any = {};
        let others: any = {};
        let qrCodeStatus = 0;
        let appointmentFeatureStatus = 0;
        let galleryFeatureStatus = 0;
        let productFeatureStatus = 0;
        let enquiryFeatureStatus = 0;
        let businesshourFeatureStatus = 0;
        let aboutFeatureStatus = 0;
        for (const featureEle of featureRows) {
            if (featureEle.type === config.vcfType) vcf[featureEle.slug] = featureEle.status;
            if (featureEle.type === config.socialType) socials[featureEle.slug] = featureEle.status;
            if (featureEle.type === config.otherType) others[featureEle.slug] = featureEle.status;
            if (featureEle.slug === 'appointment') appointmentFeatureStatus = featureEle.status;
            if (featureEle.slug === 'portfolio') galleryFeatureStatus = featureEle.status;
            if (featureEle.slug === 'services') productFeatureStatus = featureEle.status;
            if (featureEle.slug === 'contacts') enquiryFeatureStatus = featureEle.status;
            if (featureEle.slug === 'business-hour') businesshourFeatureStatus = featureEle.status;
            if (featureEle.slug === 'about') aboutFeatureStatus = featureEle.status;
            if (featureEle.slug == 'qr_code') qrCodeStatus = featureEle.status;
            if (featureEle.slug == 'set-pin') vcf[featureEle.slug] = featureEle.status;
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

        for await (const ele of vcfInfoRows) {
            if (ele.type === config.vcfGender) gender = ele.value;
            if (ele.type === config.vcfDesignation) designation = ele.value;
            if (ele.type === config.vcfDepartment) department = ele.value;
            if (ele.type === config.vcfNotes) notes = ele.value;
            if (ele.type === config.vcfDob) dob = ele.value;
            if (ele.type === config.vcfName) name = ele.value;
            if (ele.type === config.vcfNumber || ele.type === config.vcfPhone) phone.push({ number: ele.value });
            if (ele.type === config.vcfEmail) email.push(ele.value);
            if (ele.type === config.vcfAddress) address.push(ele.value);
            if (ele.type === config.vcfCompany) company.push(ele.value);
            if (ele.type === config.vcfWebsite) website.push(ele.value);
        }

        let socialLink = [];
        let socialContacts = [];
        let socialBusiness = [];
        let socialPayment = [];
        for await (const socialEle of socialRows) {
            if (socialEle.social_type === config.socialType) socialLink.push(socialEle);
            if (socialEle.social_type === config.contactType) socialContacts.push(socialEle);
            if (socialEle.social_type === config.businessType) socialBusiness.push(socialEle);
            if (socialEle.social_type === config.paymentType) socialPayment.push(socialEle);
        }

        let primaryProfileLink = profileRows[0].primary_profile_link;
        if (primaryProfileLink != null) {
            if (primaryProfileLink == `https://vkardz.com/${key}` || primaryProfileLink == `http://vkardz.com/${key}` || primaryProfileLink == `https://www.vkardz.com/${key}` || primaryProfileLink == `http://www.vkardz.com/${key}`) {
                primaryProfileLink = null
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
                is_expired: packageRows[0]?.is_expired ?? null,
                profile_package: packageRows[0]?.package_id ?? null,
                package_name: packageRows[0]?.package_slug ?? null,

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
        }

        return apiResponse.successResponse(res, profileResMsg.vcardProfile.successMsg, profile_data);

    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================
