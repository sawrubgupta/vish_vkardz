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
exports.socialRegister = exports.register = void 0;
const apiResponse = __importStar(require("../../helper/apiResponse"));
const dbV2_1 = __importDefault(require("../../../../dbV2"));
const utility = __importStar(require("../../helper/utility"));
const qrCode_1 = require("../../helper/qrCode");
const md5_1 = __importDefault(require("md5"));
const development_1 = __importDefault(require("../../config/development"));
const responseMsg_1 = __importDefault(require("../../config/responseMsg"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const handlebars_1 = __importDefault(require("handlebars"));
const registerMsg = responseMsg_1.default.user.register;
//not used
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, username, dial_code, phone, country, fcmToken } = req.body;
        const justDate = utility.dateWithFormat();
        const endDate = utility.extendedDateWithFormat("yearly");
        const qrData = yield (0, qrCode_1.generateQr)(username);
        let vcardLink = development_1.default.vcardLink;
        let uName;
        let featureStatus;
        let featureResult;
        const hash = (0, md5_1.default)(password);
        let referralCode;
        referralCode = utility.randomString(6);
        const checkUser = `Select email, phone, username, referral_code from users where email = ? || phone = ? || username = ? || referral_code = ? limit 1`;
        const checkUserVALUES = [email, phone, username, referralCode];
        const [rows] = yield dbV2_1.default.query(checkUser, checkUserVALUES);
        if (rows[0].referral_code === referralCode) {
            referralCode = utility.randomString(6);
        }
        const dupli = [];
        if (rows.length > 0) {
            if (rows[0].email === email) {
                dupli.push("email");
            }
            if (rows[0].username === username) {
                dupli.push("username");
            }
            if (rows[0].phone === phone) {
                dupli.push("phone");
            }
            console.log(dupli);
            const msg = `${dupli.join()} is duplicate, Please change it`;
            return res.status(400).json({
                status: false,
                data: null,
                message: msg,
            });
        }
        const checkPackageQuery = `Select * from features_type where status = 1 && slug = 'pro' `;
        const [packageFound] = yield dbV2_1.default.query(checkPackageQuery);
        if (packageFound.length > 0) {
            const sql = `Insert into users(name, full_name, email, display_email, password, username, dial_code, qr_code, phone, display_dial_code, display_number, country, referral_code, offer_coin, quick_active_status, is_deactived, is_verify, is_payment, is_active, is_expired, post_time, start_date, login_time, end_date, fcm_token, account_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const VALUES = [name, name, email, email, hash, username, dial_code, qrData.data, phone, dial_code, phone, country, referralCode, 0, 1, 0, 1, 1, 1, 0, justDate, justDate, justDate, endDate, fcmToken, packageFound[0].id];
            const [userData] = yield dbV2_1.default.query(sql, VALUES);
            if (userData.affectedRows > 0) {
                let userProfileSql = `INSERT INTO users_profile(user_id, profile_image, cover_photo, qr_code, language, vcard_layouts, vcard_bg_color, set_password, on_tap_url, is_default, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                const VALUES = [userData.insertId,];
                const getUserName = `SELECT * FROM users WHERE id = ${userData.insertId} LIMIT 1`;
                const [userRows] = yield dbV2_1.default.query(getUserName);
                if (userRows[0].card_number !== null && userRows[0].card_number !== undefined && userRows[0].card_number !== '') {
                    uName = userRows[0].card_number;
                }
                else if (userRows[0].card_number_fix !== null && userRows[0].card_number_fix !== undefined && userRows[0].card_number_fix !== '') {
                    uName = userRows[0].card_number_fix;
                }
                else {
                    uName = userRows[0].username;
                }
                let vcardProfileLink = (vcardLink) + (uName);
                const getFeatures = `SELECT * FROM features WHERE status = 1`;
                const [featureData] = yield dbV2_1.default.query(getFeatures);
                if (featureData.length > 0) {
                    let addFeatures = `INSERT INTO users_features (feature_id, user_id,status) VALUES`;
                    featureData.forEach((element) => __awaiter(void 0, void 0, void 0, function* () {
                        if (element.id === 1 || element.id === 2 || element.id === 13 || element.id === 14 || element.id === 15) {
                            featureStatus = 1;
                        }
                        else {
                            featureStatus = 0;
                        }
                        addFeatures = addFeatures + `(${element.id},'${userData.insertId}',${featureStatus}), `;
                        featureResult = addFeatures.substring(0, addFeatures.lastIndexOf(','));
                    }));
                    const [userFeatureData] = yield dbV2_1.default.query(featureResult);
                }
                else {
                    return apiResponse.errorMessage(res, 400, "Can not get features");
                }
                userRows[0].share_url = vcardProfileLink;
                if (userRows.length > 0) {
                    delete userRows[0].password;
                    delete userRows[0].id;
                    let token = yield utility.jwtGenerate(userRows[0].id);
                    return res.status(200).json({
                        status: true,
                        token,
                        data: userRows[0],
                        message: "Congratulations, Registered successfully !",
                    });
                }
                else {
                    return apiResponse.errorMessage(res, 400, "Contact Support Team!!");
                }
            }
            else {
                return apiResponse.errorMessage(res, 400, "Failed to Register, Please try again later");
            }
        }
        else {
            return apiResponse.errorMessage(res, 400, "Package not found!");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.register = register;
// ====================================================================================================
// ====================================================================================================
const socialRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const client = await pool.getConnection();
    try {
        const { type, socialId, email, password, country, countryName, fcmToken, deviceId, deviceType, refer_code } = req.body;
        const justDate = utility.dateWithFormat();
        const endDate = utility.extendedDateWithFormat("yearly");
        const extendedDate = utility.extendedDateAndTime("monthly");
        // const qrCode = await generateQr("username");
        // console.log("qrCode", qrCode);
        // return
        // const mailMsg = `Dear ${name},
        // Congratulations! You've successfully registered on vKardz, and we're excited to have you on board.
        // `;
        // const result:any = await utility.sendTestMail(email, "Welcome to vKardz!", mailMsg);
        // console.log("result", result);
        // await client.query("START TRANSACTION");
        let vcardLink = development_1.default.vkardUrl;
        const hash = (0, md5_1.default)(password);
        let referralCode;
        referralCode = utility.randomString(8);
        const referSql = `SELECT referral_code FROM users where referral_code = '${referralCode}' LIMIT 1`;
        const [referRows] = yield dbV2_1.default.query(referSql);
        if (referRows.length > 0)
            referralCode = utility.randomString(10);
        let profileIdUniq = utility.randomString(6);
        const checkProfile = `SELECT profile_id FROM users_profile WHERE profile_id = '${profileIdUniq}' AND deleted_at IS NULL LIMIT 1`;
        const [profileRows] = yield dbV2_1.default.query(checkProfile);
        if (profileRows.length > 0)
            profileIdUniq = utility.randomString(10);
        const primaryProfileLink = (vcardLink) + (profileIdUniq);
        const qrData = yield (0, qrCode_1.generateQr)(profileIdUniq);
        let uName;
        let featureStatus;
        let featureResult;
        let facebookId;
        let googleId;
        let appleId;
        if (type === "email") {
            facebookId = null;
            googleId = null;
            appleId = null;
        }
        else if (type === "facebook") {
            facebookId = socialId;
            googleId = null;
            appleId = null;
        }
        else if (type === "google") {
            facebookId = null;
            googleId = socialId;
            appleId = null;
        }
        else if (type === "apple") {
            facebookId = null;
            googleId = null;
            appleId = socialId;
        }
        else {
            return apiResponse.errorMessage(res, 400, registerMsg.socialRegister.wrongType);
        }
        // const emailSql = `SELECT * FROM users where status = 0 AND deleted_at IS NULL AND (email = ? or username = ? or phone = ? or facebook_id = ? or google_id = ? or apple_id = ?) LIMIT 1`;
        // const emailValues = [email, username, phone, socialId, socialId, socialId, referralCode]
        const emailSql = `SELECT * FROM users where email = ? LIMIT 1`;
        const emailValues = [email];
        const [data] = yield dbV2_1.default.query(emailSql, emailValues);
        const dupli = [];
        if (data.length > 0) {
            if ((yield data[0].deleted_at) != null)
                return apiResponse.errorMessage(res, 400, registerMsg.socialRegister.accountDeleted);
            if ((yield data[0].email) == email) {
                dupli.push("email");
            }
            else {
                dupli.push("email");
            }
            // if (data[0].facebook_id  === socialId) {
            //     dupli.push("facebook id ");
            // } 
            // if (data[0].google_id === socialId) {
            //     dupli.push("google id");
            // } 
            // if (data[0].apple_id === socialId) {
            //     dupli.push("apple id");
            // }
            console.log(dupli);
            // if (dupli.length === 0) email/username
            const msg = `${dupli.join()} is duplicate, Please change it`;
            return res.status(400).json({
                status: false,
                data: null,
                message: msg,
            });
        }
        let referCodeRows = [];
        if (refer_code && refer_code != null) {
            const referCodeSql = `SELECT id, referral_code, offer_coin FROM users WHERE referral_code = '${refer_code}'`;
            [referCodeRows] = yield dbV2_1.default.query(referCodeSql);
            if (referCodeRows.length === 0)
                return apiResponse.errorMessage(res, 400, registerMsg.socialRegister.invalidReferCode);
        }
        const sql = `INSERT INTO users(email, display_email, password, qr_code, currency_code, country, country_name, referral_code, offer_coin, quick_active_status, is_deactived, is_verify, is_payment, is_active, is_expired, post_time, start_date, login_time, end_date, account_type, primary_profile_slug, fcm_token, device_id, device_type, facebook_id, google_id, apple_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const VALUES = [email, email, hash, qrData, 'USD', country, countryName, referralCode, 100, 1, 0, 1, 1, 1, 0, justDate, justDate, justDate, endDate, 16, 'vcard', fcmToken, deviceId, deviceType, facebookId, googleId, appleId];
        const [userData] = yield dbV2_1.default.query(sql, VALUES);
        if (userData.affectedRows > 0) {
            const userId = userData.insertId;
            let userProfileSql = `INSERT INTO users_profile(user_id, profile_id, theme_name, qr_code, on_tap_url, is_default, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const profileVALUES = [userData.insertId, profileIdUniq, 'Profile' + profileIdUniq, qrData, primaryProfileLink, 1, justDate];
            const [profileRows] = yield dbV2_1.default.query(userProfileSql, profileVALUES);
            const profileId = profileRows.insertId;
            const vcfInfoSql = `INSERT INTO vcf_info(user_id, profile_id, type, value, status, created_at) VALUES(?, ?, ?, ?, ?, ?)`;
            const vcfVALUES = [userId, profileId, development_1.default.vcfEmail, email, 1, justDate];
            const [vcfInfoRows] = yield dbV2_1.default.query(vcfInfoSql, vcfVALUES);
            const getUserName = `SELECT * FROM users WHERE id = ${userData.insertId} LIMIT 1`;
            const [userRows] = yield dbV2_1.default.query(getUserName);
            if (userRows[0].card_number !== null && userRows[0].card_number !== undefined && userRows[0].card_number !== '') {
                uName = userRows[0].card_number;
            }
            else if (userRows[0].card_number_fix !== null && userRows[0].card_number_fix !== undefined && userRows[0].card_number_fix !== '') {
                uName = userRows[0].card_number_fix;
            }
            else {
                uName = userRows[0].username;
            }
            let vcardProfileLink = (vcardLink) + (uName);
            const getFeatures = `SELECT * FROM features WHERE status = 1`;
            const [featureData] = yield dbV2_1.default.query(getFeatures);
            let addFeatures = `INSERT INTO users_features(feature_id, user_id, profile_id, status) VALUES`;
            for (const element of featureData) {
                console.log("element.id", element.id);
                if (element.id === 1 || element.id === 2 || element.id === 13 || element.id === 15 || (element.id >= 19 && element.id !== 30 && element.id !== 31 && element.id !== 34 && element.id !== 35 && element.id !== 36 && element.id !== 38)) {
                    featureStatus = 1;
                }
                else {
                    featureStatus = 0;
                }
                addFeatures = addFeatures + `(${element.id}, ${userData.insertId}, ${profileId}, ${featureStatus}), `;
                featureResult = addFeatures.substring(0, addFeatures.lastIndexOf(','));
            }
            const [userFeatureData] = yield dbV2_1.default.query(featureResult);
            userRows[0].share_url = vcardProfileLink;
            if (refer_code && refer_code != null) {
                // const referCodeSql = `SELECT id, referral_code, offer_coin FROM users WHERE referral_code = '${refer_code}'`;
                // const [referCodeRows]:any = await client.query(referCodeSql);
                // if (referCodeRows.length === 0) return apiResponse.errorMessage(res, 400, "Invalid Refferal Code");
                const referAmountSql = `SELECT * FROM vkoin_limit LIMIT 1`;
                const [referAmountRows] = yield dbV2_1.default.query(referAmountSql);
                const offerCoin = referCodeRows[0].offer_coin + referAmountRows[0].referrer_coin;
                const addreferral = `INSERT INTO referrals(user_id, referrer_user_id, refer_code, created_at) VALUES(?, ?, ?, ?)`;
                const referVALUES = [userId, referCodeRows[0].id, referralCode, justDate];
                const [referRows] = yield dbV2_1.default.query(addreferral, referVALUES);
                const coinSql = `INSERT INTO user_coins(user_id, type, coin, used_coin_amount, coin_status, created_at, expired_at) VALUES(?, ?, ?, ?, ?, ?, ?)`;
                const coinVALUES = [referCodeRows[0].id, development_1.default.referrerType, referAmountRows[0].referrer_coin, 0, development_1.default.activeStatus, justDate, extendedDate[0]];
                const [coinRows] = yield dbV2_1.default.query(coinSql, coinVALUES);
                const updateReferreData = `UPDATE users SET offer_coin = offer_coin + ${offerCoin} WHERE id = ${referCodeRows[0].id}`;
                const [data] = yield dbV2_1.default.query(updateReferreData);
            }
            // await client.query("COMMIT");
            let token = yield utility.jwtGenerate(userRows[0].id);
            delete userRows[0].password;
            delete userRows[0].id;
            var source = fs_1.default.readFileSync(path_1.default.join('./views', 'registrationConfirmation.hbs'), 'utf8');
            var template = handlebars_1.default.compile(source);
            var htmlData = { email: email };
            var sendData = template(htmlData);
            const result = yield utility.sendHtmlMail(email, "Welcome to vKardz!", sendData);
            if (result == false)
                console.log("Failed to send email", result);
            console.log("email result", result);
            const data = {
                profileId: profileId,
            };
            return res.status(200).json({
                status: true,
                token,
                data: data,
                message: registerMsg.socialRegister.successMsg,
            });
        }
        else {
            return apiResponse.errorMessage(res, 400, registerMsg.socialRegister.failedMsg);
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
exports.socialRegister = socialRegister;
// ====================================================================================================
// ====================================================================================================
/*
//
export const register =async (req:Request, res:Response) => {
    try {
        const { name, email, password, username, dial_code, phone, country, country_name } = req.body;
        const justDate = utility.dateWithFormat();
        const endDate = utility.extendedDateWithFormat("yearly");
        const qrData = await getQr(username);
        let vcardLink = `https://vkardz.com/`
        let uName;
        let featureStatus:number;
        let featureResult:any;

        const checkUser = `Select email, phone, username from users where email = ? || phone = ? || username = ? limit 1`;
        const checkUserVALUES = [email, phone, username];
        const [rows]:any = await pool.query(checkUser, checkUserVALUES);

        const dupli = [];
        if (rows.length > 0) {
            if (rows[0].email === email) {
                dupli.push("email");
            }
            if (rows[0].username === username) {
                dupli.push("username");
            }
            if (rows[0].phone === phone) {
                dupli.push("phone");
            }
            console.log(dupli);
            
            const msg = `${dupli.join()} is duplicate, Please change it`;
            return res.status(400).json({
                status: false,
                data: null,
                message: msg,
            });
        }

        const checkPackageQuery = `Select * from features_type where status = 1 && slug = 'pro' `;
        const [packageFound]:any = await pool.query(checkPackageQuery);
        if (packageFound.length > 0) {
            bcrypt.hash(password, 10, async (err, hash) => {
                if (err) {
                    return apiResponse.errorMessage(res, 400, "Something Went Wrong, try again");
                } else {
                    const sql = `Insert into users(name, full_name, email, display_email, password, username, dial_code, qr_code, phone, display_dial_code, display_number, country, offer_coin, quick_active_status, is_deactived, is_verify, is_payment, is_active, is_expired, post_time, start_date, login_time, end_date, account_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    const VALUES = [name, name, email, email, hash, username, dial_code, qrData.data, phone, dial_code, phone, country, 100, 1, 0, 1, 1, 1, 0, justDate, justDate, justDate, endDate, packageFound[0].id];
                    const [userData]:any = await pool.query(sql, VALUES);
    
                    if (userData.affectedRows > 0) {
                        const getUserName = `SELECT * FROM users WHERE id = ${userData.insertId} LIMIT 1`;
                        const [userRows]:any = await pool.query(getUserName)
                        
                        if (userRows[0].card_number !== null && userRows[0].card_number !== undefined && userRows[0].card_number !== '') {
                            uName = userRows[0].card_number;
                        } else if (userRows[0].card_number_fix !== null && userRows[0].card_number_fix !== undefined && userRows[0].card_number_fix !== '') {
                            uName = userRows[0].card_number_fix;
                        } else {
                            uName = userRows[0].username
                        }
                        let vcardProfileLink = (vcardLink)+(uName)

                        const getFeatures = `SELECT * FROM features WHERE status = 1`;
                        const [featureData]:any = await pool.query(getFeatures);

                        if (featureData.length > 0) {
                            let addFeatures:any = `INSERT INTO users_features (feature_id, user_id,status) VALUES`;
                            featureData.forEach(async (element: any) => {
                                if (element.id === 1 || element.id === 2 || element.id === 13 || element.id === 14 || element.id === 15) {
                                    featureStatus = 1
                                } else {
                                    featureStatus = 0
                                }
                                addFeatures = addFeatures + `(${element.id},'${userData.insertId}',${featureStatus}), `;
                                featureResult = addFeatures.substring(0,addFeatures.lastIndexOf(','));
                            })
                            const [userFeatureData]:any = await pool.query(featureResult)
                        } else {
                            return apiResponse.errorMessage(res, 400, "Can not get features");
                        }
                        userRows[0].share_url= vcardProfileLink;
                        if (userRows.length > 0) {
                            delete userRows[0].password;
                            delete userRows[0].id;
                            let token = await utility.jwtGenerate(userRows[0].id);
                            return res.status(200).json({
                                status: true,
                                token,
                                data: userRows[0],
                                message: "Congratulations, Registered successfully !",
                              });
                        } else {
                            return apiResponse.errorMessage(res, 400, "Contact Support Team!!");
                        }

                    } else {
                        return apiResponse.errorMessage(res, 400, "Failed to Register, Please try again later")
                    }
                }
            });
        } else {
            return apiResponse.errorMessage(res, 400, "Package not found!");
        }
    
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
}
*/
// ====================================================================================================
// ====================================================================================================
