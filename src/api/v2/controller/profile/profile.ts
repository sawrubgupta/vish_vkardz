import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';


export const getProfile =async (req:Request, res:Response) => {
    try {
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !")
        }
          
        const getUserQuery = `SELECT * FROM users WHERE id = ${userId} LIMIT 1`;
        const [userRows]:any = await pool.query(getUserQuery);
        
        if (userRows.length > 0) {
            delete userRows[0].id;
            delete userRows[0].password;

            const getSocialSiteQuery = `SELECT social_sites.id, social_sites.name, social_sites.social_link, social_sites.social_img, social_sites.type, social_sites.status, social_sites.primary_profile, vcard_social_sites.value, vcard_social_sites.label, vcard_social_sites.orders FROM social_sites LEFT JOIN vcard_social_sites ON social_sites.id = vcard_social_sites.site_id AND vcard_social_sites.user_id = ${userId} HAVING vcard_social_sites.value IS NOT NULL ORDER BY vcard_social_sites.value DESC, vcard_social_sites.orders IS NULL ASC LIMIT 6`;
            const [socialRows]:any = await pool.query(getSocialSiteQuery);

            const getCardQuery = `SELECT products.slug, products.product_image, products.image_back, products.image_other FROM products LEFT JOIN orderlist ON products.product_id = orderlist.product_id WHERE orderlist.user_id = ${userId}`;
            const [cardData]:any = await pool.query(getCardQuery);

            const getThemes = `SELECT users.themes as themeId, vkard_layouts.vkard_style, vkard_layouts.image FROM users LEFT JOIN vkard_layouts ON users.vcard_layouts = vkard_layouts.id WHERE users.id = ${userId} LIMIT 1`;
            const [themeData]:any = await pool.query(getThemes);

            const cartSql = `SELECT COUNT(id) AS totalCartItem FROM cart_details WHERE user_id = ${userId}`;
            const [cartRows]:any = await pool.query(cartSql);

            const wishlistSql = `SELECT COUNT(id) AS totalWishlistItem FROM wishlist WHERE user_id = ${userId}`;
            const [wishlistRows]:any = await pool.query(wishlistSql);

            userRows[0].social_sites = socialRows || [];
            userRows[0].cardData = cardData || [];
            userRows[0].activeTheme = themeData[0] || {};
            userRows[0].totalCartItem = cartRows[0].totalCartItem || 0
            userRows[0].totalWishlistItem = wishlistRows[0].totalWishlistItem || 0

            return apiResponse.successResponse(res, "Get user profile data!", userRows[0]);
        } else {
            return apiResponse.errorMessage(res, 400, "User not found!");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const updateProfile =async (req:Request, res:Response) => {
    try {
        // const userId: string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !")
        }

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
        const [data]:any = await pool.query(updateQuery, VALUES);

        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res,"Profile updated successfully !", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to update the user, please try again later !");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const updateVcardinfo =async (req:Request, res:Response) => {
    try {
        // const userId: string = res.locals.jwt.userId;
        let userId:any; 
        const type = req.query.type; //type = business, user, null
        if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
            userId = req.query.userId;
        } else {
            userId = res.locals.jwt.userId;
        }
        if (!userId || userId === "" || userId === undefined) {
            return apiResponse.errorMessage(res, 401, "Please login !")
        }

        const { name, dialCode, phone, email, country, countryName, gender } = req.body;

        const checkUser = `SELECT * FROM users where deleted_at IS NULL AND (phone = ? || email = ?) AND id != ? LIMIT 1`;
        const checkUserVALUES = [phone, email, userId];
        const [rows]:any = await pool.query(checkUser, checkUserVALUES);

        if (rows.length > 0) {
            const dupli = [];
            if(email === rows[0].email){
                dupli.push("email")
            }
            if(phone === rows[0].phone){
                 dupli.push("phone")
             }
             if (dupli.length > 0) {
                return await apiResponse.errorMessage(res,400,`${dupli.join()} is already exist, Please change`);
             }
        }

        const updateQuery = `UPDATE users SET name = ?, dial_code = ?, phone = ?, email = ?, country = ?, country_name = ?, gender = ? WHERE id = ?`;
        const VALUES = [name, dialCode, phone, email, country, countryName, gender, userId];
        const [data]:any = await pool.query(updateQuery, VALUES);

        if (data.affectedRows > 0) {
            return apiResponse.successResponse(res,"Profile updated successfully !", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Failed to update the user, please try again later !");
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

//according new json
export const updateImage =async (req:Request, res:Response) => {
    // const userId: string = res.locals.jwt.userId;
    let userId:any; 
    const type = req.query.type; //type = business, user, null
    if (type && (type === config.businessType  || type === config.websiteType || type === config.vcfWebsite)) {
        userId = req.query.userId;
    } else {
        userId = res.locals.jwt.userId;
    }
    if (!userId || userId === "" || userId === undefined) {
        return apiResponse.errorMessage(res, 401, "Please login !")
    }

    const { profileId, profileImage, coverImage } = req.body;
    if (!profileId || profileId === null || profileId === undefined) return apiResponse.errorMessage(res, 400, "Profile id is required");

    const sql = `UPDATE users_profile SET profile_image = ?, cover_photo = ? WHERE user_id = ? AND id = ?`;
    const VALUES = [profileImage, coverImage, userId, profileId];
    const [rows]:any = await pool.query(sql, VALUES);

    if (rows.affectedRows > 0) {
        return apiResponse.successResponse(res, "Image Updated Sucessfully", null);
    } else {
        return apiResponse.errorMessage(res, 400, "Failed to update image, try again");
    }
}

// ====================================================================================================
// ====================================================================================================


//updated profile with new json
export const vcardProfile =async (req:Request, res:Response) => {
    try {
        // const username = req.query.username;
        let key:any = req.query.key;

        if (!key || key === null) return apiResponse.errorMessage(res, 400, "User Profile not exist!!");

        const splitCode = key.split(config.vcardLink);
        let newCardNum:any = splitCode[1] || '';

        let splitNewCardNumber = newCardNum.split('/');
        let newCardNumber = splitNewCardNumber[0] || newCardNum || key;
        console.log("newCardNumber", newCardNumber);

        const userSql = `SELECT users.id, users.username, users.type, users.referral_code, users.offer_coin, users.country, users.country_name, users.currency_code, users.device_type, business_admin.image, business_admin.company FROM users LEFT JOIN business_admin ON business_admin.id = users.admin_id WHERE users.deleted_at IS NULL AND (users.username = '${key}' OR users.username = '${newCardNumber}' OR users.card_number = '${key}' OR users.card_number = '${newCardNumber}' OR users.card_number_fix = '${key}' OR users.card_number_fix = '${newCardNumber}') LIMIT 1`;
        const [userRows]:any = await pool.query(userSql);

        if (userRows.length === 0) return apiResponse.errorMessage(res, 400, "Profile not found!");
        const userId = userRows[0].id;

        const userProfileSql = `SELECT * FROM users_profile WHERE deleted_at IS NULL AND user_id = ${userId}`;
        const [profileRows]:any = await pool.query(userProfileSql);

        const vcfInfoSql = `SELECT * FROM vcf_info WHERE user_id = ${userId} AND profile_id = ${profileRows[0].id}`;
        const [vcfInfoRows]:any = await pool.query(vcfInfoSql);

        const customFieldSql = `SELECT icon, value, type FROM vcf_custom_field WHERE user_id = ${userId} AND status = 1`;
        const [customFieldRows]:any = await pool.query(customFieldSql);

        const productSql = `SELECT id, title, overview as description, currency_code, images, price, status FROM services WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT 5`;
        const [productRows]:any = await pool.query(productSql);

        const gallarySql = `SELECT * FROM portfolio WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT 5`;
        const [gallareRows]:any = await pool.query(gallarySql);

        const businessHourSql = `SELECT * FROM business_hours WHERE user_id = ${userId}`;
        const [businessHourRows]: any = await pool.query(businessHourSql);

        const aboutSql = `SELECT id, company_name, business, year, about_detail, images, created_at FROM about WHERE user_id = ${userId}`;
        const [aboutUsRows]:any = await pool.query(aboutSql);

        const videoSql = `SELECT * FROM videos WHERE user_id = ${userId} LIMIT 5`;
        const [videoRows]:any = await pool.query(videoSql);

        const getSocialSiteQuery = `SELECT social_sites.id, social_sites.name, social_sites.social_link, social_sites.social_img, social_sites.type, social_sites.status, social_sites.social_type, social_sites.primary_profile, vcard_social_sites.value, vcard_social_sites.label, vcard_social_sites.orders FROM social_sites LEFT JOIN vcard_social_sites ON social_sites.id = vcard_social_sites.site_id AND vcard_social_sites.user_id = ${userId} HAVING vcard_social_sites.value IS NOT NULL ORDER BY vcard_social_sites.value DESC, vcard_social_sites.orders IS NULL ASC`;
        const [socialRows]:any = await pool.query(getSocialSiteQuery);

        const featureSql = `SELECT users_features.feature_id, features.type, features.features, features.slug, users_features.status FROM features LEFT JOIN users_features ON features.id = users_features.feature_id WHERE users_features.user_id = ${userId}`;
        const [featureRows]:any = await pool.query(featureSql);

        let vcf:any = {};
        let socials:any = {};
        let others:any = {};
        for (const featureEle of featureRows) {
            if (featureEle.type === config.vcfType) vcf[featureEle.slug] = featureEle.status;
            if (featureEle.type === config.socialType) socials[featureEle.slug] = featureEle.status;
            if (featureEle.type === config.otherType) others[featureEle.slug] = featureEle.status;
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
            if (ele.type === config.vcfNumber) phone.push({number: ele.value});
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
        
        const profile_data= {
            userId: userRows[0].id,
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
            theme:{
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
                profile_link: profileRows[0].on_tap_url,
                qr_code: profileRows[0].qr_code
            },
            products: productRows,
            gallery: gallareRows,
            business_hours: businessHourRows,
            about_us:aboutUsRows,
            videos: videoRows,

            profile_setting: {
                is_card_linked: profileRows[0].is_card_linked,
                is_expired: profileRows[0].is_expired,
                profile_package: productRows[0].account_type,
                package_name: productRows[0].package_name,
                currency_code: userRows[0].currency_code,
                device_type: userRows[0].device_type,
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
                    socials: socials,
                    others: others
                },
                profile_language: profileRows[0].language,
    
            }
        }

        return apiResponse.successResponse(res, "Data Retrieved Successfully", profile_data);

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
