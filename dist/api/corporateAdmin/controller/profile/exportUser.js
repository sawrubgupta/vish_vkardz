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
exports.exportUserOld = exports.importSampleFile = exports.importUser = exports.exportUser = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const development_1 = __importDefault(require("../../config/development"));
const exceljs_1 = __importDefault(require("exceljs"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const xlsx_1 = __importDefault(require("xlsx"));
const qrCode_1 = require("../../helper/qrCode");
const md5_1 = __importDefault(require("md5"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const credentials = development_1.default.AWS;
const bucketName = development_1.default.BUCKET_NAME;
const exportUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        const userId = res.locals.jwt.userId;
        const createdAt = utility.dateWithFormat();
        // type data = {
        //     user_id: number;
        //     username: string;
        //     full_name: string;
        //     email: string;
        //     phone: string;
        //     website: string;
        //     designation: string;
        //     company_name:string;
        //   };
        const sql = `SELECT id as user_id, username, card_number, name, email, display_email, display_dial_code, display_number, phone, designation, website, address, company_name, hit, share_link FROM users WHERE admin_id = ${userId} ORDER BY username asc`;
        const [rows] = yield db_1.default.query(sql);
        const workbook = new exceljs_1.default.Workbook();
        const worksheet = workbook.addWorksheet('User Detail');
        let columnsHeader = [
            { key: 'username', header: 'username', width: 20 },
            { key: 'card_number', header: 'Card Number', width: 10 },
            { key: 'name', header: 'Full Name', width: 20 },
            { key: 'display_email', header: 'Email', width: 40 },
            { key: 'display_dial_code', header: 'Dial Code', width: 10 },
            { key: 'display_number', header: 'Phone Number', width: 20 },
            { key: 'company_name', header: 'Company Name', width: 20 },
            { key: 'designation', header: 'Designation', width: 50 },
            { key: 'website', header: 'Website', width: 20 },
            { key: 'address', header: 'Address', width: 50 },
            { key: 'hit', header: 'Total View', width: 8 },
            { key: 'value', header: 'Facebook', width: 30 },
            { key: 'value', header: 'Twitter', width: 30 },
            { key: 'value', header: 'Instagram', width: 30 },
            { key: 'value', header: 'Linkedin', width: 30 },
            { key: 'value', header: 'Youtube', width: 30 },
            { key: 'value', header: 'WhatsApp', width: 30 },
            { key: 'value', header: 'Amazon', width: 30 },
            { key: 'value', header: 'Apple Pay', width: 30 },
            { key: 'value', header: 'Behance', width: 30 },
            { key: 'value', header: 'Blogger', width: 30 },
            { key: 'value', header: 'Clubhouse', width: 30 },
            { key: 'value', header: 'Custom Link', width: 30 },
            { key: 'value', header: 'Discord', width: 30 },
            { key: 'value', header: 'Discord', width: 30 },
            { key: 'value', header: 'Drive', width: 30 },
            { key: 'value', header: 'Dropbox', width: 30 },
            { key: 'value', header: 'Email', width: 30 },
            { key: 'value', header: 'Evanto', width: 30 },
            { key: 'value', header: 'Evernote', width: 30 },
            { key: 'value', header: 'Fiver', width: 30 },
            { key: 'value', header: 'Freelance', width: 30 },
            { key: 'value', header: 'Github', width: 30 },
            { key: 'value', header: 'Gmail', width: 30 },
            { key: 'value', header: 'Google Plus', width: 30 },
            { key: 'value', header: 'Google Pay', width: 30 },
            { key: 'value', header: 'Keybase', width: 30 },
            { key: 'value', header: 'Messenger', width: 30 },
            { key: 'value', header: 'Line', width: 30 },
            { key: 'value', header: 'Medium', width: 30 },
            { key: 'value', header: 'Menu', width: 30 },
            { key: 'value', header: 'Patreon', width: 30 },
            { key: 'value', header: 'Paypal', width: 30 },
            { key: 'value', header: 'Phone', width: 30 },
            { key: 'value', header: 'Pinterest', width: 30 },
            { key: 'value', header: 'Quora', width: 30 },
            { key: 'value', header: 'Qzone', width: 30 },
            { key: 'value', header: 'Razorpay', width: 30 },
            { key: 'value', header: 'Reddit', width: 30 },
            { key: 'value', header: 'Rss', width: 30 },
            { key: 'value', header: 'Skype', width: 30 },
            { key: 'value', header: 'Slack', width: 30 },
            { key: 'value', header: 'Sms', width: 30 },
            { key: 'value', header: 'Snapchat', width: 30 },
            { key: 'value', header: 'Soundcloud', width: 30 },
            { key: 'value', header: 'Stripe', width: 30 },
            { key: 'value', header: 'Telegram', width: 30 },
            { key: 'value', header: 'Threema', width: 30 },
            { key: 'value', header: 'Tiktok', width: 30 },
            { key: 'value', header: 'Tumbler', width: 30 },
            { key: 'value', header: 'Twitch', width: 30 },
            { key: 'value', header: 'Upwork', width: 30 },
            { key: 'value', header: 'Viber', width: 30 },
            { key: 'value', header: 'Vimeo', width: 30 },
            { key: 'value', header: 'Vine', width: 30 },
            { key: 'value', header: 'Vk', width: 30 },
            { key: 'value', header: 'Wechat', width: 30 },
            { key: 'value', header: 'Zoom', width: 30 },
        ];
        worksheet.columns = columnsHeader;
        // rows.forEach(async(element: any) => {
        for (const element of rows) {
            const sociaSiteSql = `SELECT social_sites.name, vcard_social_sites.label, vcard_social_sites.value FROM social_sites LEFT JOIN vcard_social_sites ON vcard_social_sites.site_id = social_sites.id AND vcard_social_sites.user_id = ${element.user_id} WHERE social_sites.status = 1 ORDER BY social_sites.id ASC`;
            const [socialRows] = yield db_1.default.query(sociaSiteSql);
            // console.log("socialRows", socialRows);
            // for (let i = 0; i < socialRows.length; i++) {
            //     const element = socialRows[i];
            //     columnsHeader.push({ key: 'value', header: socialRows[i].name })
            //     // data.push(`${socialRows[i].label}: ${socialRows[i].value}`)
            // } 
            // columns.push({ key: 'value', header: socialRows[i]. })
            const data = [element.username, element.card_number, element.name, element.display_email, element.display_dial_code, element.display_number, element.company_name, element.designation, element.website, element.address, element.hit];
            for (let i = 0; i < socialRows.length; i++) {
                let socialValue = socialRows[i].value;
                if (socialValue === null || socialValue === undefined)
                    socialValue = '';
                data.push(`${socialValue}`);
            }
            const vcfSql = `SELECT value, type FROM vcf_custom_field WHERE user_id = ${element.user_id} AND status = 1`;
            const [vcfData] = yield db_1.default.query(vcfSql);
            let vcfIndex = -1;
            try {
                for (var _d = true, vcfData_1 = (e_1 = void 0, __asyncValues(vcfData)), vcfData_1_1; vcfData_1_1 = yield vcfData_1.next(), _a = vcfData_1_1.done, !_a;) {
                    _c = vcfData_1_1.value;
                    _d = false;
                    try {
                        const ele = _c;
                        vcfIndex++;
                        columnsHeader.push({ key: 'value', header: 'Custom ' + ele.type });
                        data.push(`${vcfData[vcfIndex].value}`);
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = vcfData_1.return)) yield _b.call(vcfData_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            worksheet.addRow(data);
            console.log("data", data);
        }
        ;
        const exportPath = path_1.default.resolve(__dirname, `users${userId}.xlsx`);
        console.log(exportPath);
        yield workbook.xlsx.writeFile(exportPath);
        worksheet.columns.forEach((column) => {
            column.font = {
                size: 12,
            };
            column.width = 100;
        });
        worksheet.getRow(1).font = {
            bold: true,
            size: 13,
        };
        console.log("exportPath", exportPath);
        var excelBucket = new aws_sdk_1.default.S3({
            credentials,
            params: {
                Bucket: bucketName
            }
        });
        excelBucket.upload({
            // ACL: 'public-read', 
            Body: fs_1.default.createReadStream(exportPath),
            Key: `records${createdAt}.xlsx`, // file upload by below name
            // ContentType: 'application/octet-stream' // force download if it's accessed as a top location
        }, (err, response) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log(err);
                return apiResponse.errorMessage(res, 400, "Failed!, Please Try again");
            }
            if (response) {
                fs_1.default.unlink(exportPath, (err) => {
                    if (err)
                        throw err; //handle your error the way you want to;
                    console.log('file was deleted'); //or else the file will be deleted
                });
            }
            console.log(response.Location);
            return apiResponse.successResponse(res, "Success", response.Location);
        }));
        //         let result;
        //         const fileStream = fs.createReadStream(path.resolve(__dirname, `Screenshot 2023-03-02 212441.png`));
        //         let form = new FormData();
        //         form.append('file', fileStream);
        //         const config = {
        //             headers: {
        //               'content-type': 'multipart/form-data',
        //             },
        //           };
        //           await axios.post('https://vkardz.com/api/uploadFile.php', form, config)
        //           .then((response) => {
        //             result = response.data
        //             console.log(response.data);
        //           })
        //           .catch((error) => {
        //             result = error
        //             console.log(error);
        //           });          
        //         // form.append('extractArchive', 'false');
        //         //         let investorExist_response = await axios.post(
        //         //             'https://vkardz.com/api/uploadFile.php',
        //         //             form,
        //         //             {
        //         //               headers: {
        //         //                 // "Content-Type": "multipart/form-data",
        //         //                 "Content-Type": "application/x-www-form-urlencoded"
        //         //               },
        //         //             }
        //         //           );
        //         //           console.log("investorExist_response", investorExist_response);
        //         //           console.log("investorExist_response.data", investorExist_response.data);
        //         //   res.send("done");
        //         //   return        
        //         // console.log("form", form);
        //         // const response = await axios({   
        //         //     'post',
        //         //     url: `https://vkardz.com/api/uploadFile.php`,
        //         //     data: "",
        //         // });
        //         // result = response.data;
        //         // let header = form.getHeaders()
        //         // console.log("header", header);
        // /*
        //         await axios.post('https://vkardz.com/api/uploadFile.php', form, {
        //             // headers: {"content-type": "multipart/form-data"},
        //             // headers: { "content-type": "application/x-www-form-urlencoded" },
        //             headers: form.getHeaders()
        //             // headers: form.getHeaders()
        //             // headers: {"content-type": "multipart/form-data"}
        //         })
        //             .then((response) => {
        //                 console.log("response.data", response.data);
        //                 result = response.data;
        //             })
        //             .catch((error) => {
        //                 console.log("error", error);
        //                 result = false;
        //             });
        // */
        //         // let result:any = utility.uploadFile(exportPath);
        //         // console.log("result", result);
        //         // if (result === false) {
        //         //     return apiResponse.errorMessage(res, 400, "Failed to generate excel, try again");
        //         // } 
        //         // fs.unlink(exportPath, (err) => {
        //         //     if (err) throw err //handle your error the way you want to;
        //         //     console.log('file was deleted');//or else the file will be deleted
        //         // });
        //         return apiResponse.successResponse(res, "Exported Successfully", result);
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.exportUser = exportUser;
// ====================================================================================================
// ====================================================================================================
const importUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, e_2, _f, _g, _h, e_3, _j, _k, _l, e_4, _m, _o, _p, e_5, _q, _r;
    try {
        const userId = res.locals.jwt.userId;
        const createdAt = utility.dateWithFormat();
        const credentials = development_1.default.AWS;
        const bucketName = development_1.default.BUCKET_NAME;
        const justDate = utility.dateWithFormat();
        const endDate = utility.extendedDateWithFormat("yearly");
        const file = req.file;
        const fileData = xlsx_1.default.readFile(file.path); // Read the file using pathname        
        const sheetNames = fileData.SheetNames; // Grab the sheet info from the file
        const totalSheets = (sheetNames.length);
        let parsedData = []; // Variable to store our data 
        for (let i = 0; i < totalSheets; i++) { // Loop through sheets
            const tempData = xlsx_1.default.utils.sheet_to_json(fileData.Sheets[sheetNames[i]]); // Convert to json using xlsx
            // tempData.shift(); // Skip header row which is the colum names or if want header use this..
            parsedData.push(...tempData); // Add the sheet's json to our data array
        }
        if (parsedData.length === 0) {
            return apiResponse.errorMessage(res, 400, "Empty rows!!");
        }
        console.log("parsedData", parsedData);
        const maxRecord = 50;
        if (parsedData.length >= maxRecord) {
            return apiResponse.errorMessage(res, 400, `You can't insert more than ${maxRecord} records!`);
        }
        // let insertQuery =  `INSERT INTO users(username, name, card_number, card_number_fix, email, dial_code, phone, country, password, login_time, account_type, start_date, end_date, post_time, created_at) VALUES `;
        const socialLinkSql = `SELECT id, name FROM social_sites WHERE status = 1`;
        const [socialRows] = yield db_1.default.query(socialLinkSql);
        let ele;
        let duplicateData = [];
        let insertSOcialQuery = `INSERT INTO vcard_social_sites (user_id, site_id, label, value, created_at) VALUES`;
        let socialResult = null;
        let parseDataIndex = -1;
        try {
            for (var _s = true, parsedData_1 = __asyncValues(parsedData), parsedData_1_1; parsedData_1_1 = yield parsedData_1.next(), _e = parsedData_1_1.done, !_e;) {
                _g = parsedData_1_1.value;
                _s = false;
                try {
                    ele = _g;
                    parseDataIndex++;
                    const username = ele.username;
                    const email = ele.email;
                    const phone = ele.phone || '';
                    const code = ele.code;
                    const name = ele.name || '';
                    const dial_code = ele.dial_code || '';
                    const country = ele.country || '';
                    const password = ele.password;
                    const company_name = ele.company_name || '';
                    const designation = ele.designation || '';
                    const website = ele.website || '';
                    const address = ele.address || '';
                    const profile_pin = ele.profile_pin;
                    let is_password_enable = 1;
                    if (!profile_pin || profile_pin === null) {
                        is_password_enable = 0;
                    }
                    const hashPasswwoed = (0, md5_1.default)(password);
                    const qrData = yield (0, qrCode_1.getQr)(username);
                    const getCardDetail = `SELECT * FROM card_activation WHERE card_key = '${code}' LIMIT 1`;
                    const [cardData] = yield db_1.default.query(getCardDetail);
                    if (cardData.length === 0) {
                        parsedData[parseDataIndex].failedMessage = `Code is invalid, Contact support!`;
                        duplicateData.push(parsedData[parseDataIndex]);
                        continue;
                    }
                    const cardNumber = cardData[0].card_number;
                    const packageId = cardData[0].package_type; //account_type
                    const primaryProfileLink = (development_1.default.vcardLink) + (username);
                    const emailSql = `SELECT * FROM users WHERE deleted_at IS NULL AND (email = ? OR username = ? OR phone = ? OR card_number = ? OR card_number_fix = ?) LIMIT 1`;
                    const emailVALUES = [email, username, phone, cardNumber, cardNumber];
                    const [dupliRows] = yield db_1.default.query(emailSql, emailVALUES);
                    if (dupliRows.length > 0) {
                        let dupliKey;
                        if (dupliRows[0].email === email || !email || email === null) {
                            dupliKey = 'email ' + email;
                        }
                        if (dupliRows[0].username === username || !username || username === null) {
                            dupliKey = 'username ' + username;
                        }
                        if (dupliRows[0].card_number === cardNumber || dupliRows[0].card_number_fix === cardNumber || !cardNumber || cardNumber === null) {
                            dupliKey = 'code ' + cardNumber;
                        }
                        if (!code || code === null) {
                            dupliKey = 'code ' + code;
                        }
                        // if (dupliRows[0].phone === element.phone) {
                        //     // dupli.push("phone");
                        // }
                        parsedData[parseDataIndex].failedMessage = `${dupliKey} is already used!!`;
                        duplicateData.push(parsedData[parseDataIndex]);
                        continue;
                    }
                    const sql = `INSERT INTO users(admin_id, name, full_name, email, display_email, password, username, card_number, dial_code, company_name, designation, website, address, qr_code, phone, display_dial_code, display_number, country, offer_coin, quick_active_status, is_deactived, is_verify, is_payment, is_active, is_expired, is_card_linked, post_time, start_date, verify_time, login_time, end_date, account_type, is_password_enable, set_password, primary_profile_slug) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    const VALUES = [userId, name, name, email, email, hashPasswwoed, username, cardNumber, dial_code, company_name, designation, website, address, qrData.data, phone, dial_code, phone, country, 100, 1, 0, 1, 1, 1, 0, 1, justDate, justDate, justDate, justDate, endDate, packageId, is_password_enable, profile_pin, 'vcard'];
                    const [rows] = yield db_1.default.query(sql, VALUES);
                    if (rows.affectedRows > 0) {
                        const getFeatures = `SELECT * FROM features WHERE status = 1`;
                        const [featureData] = yield db_1.default.query(getFeatures);
                        let addFeatures = `INSERT INTO users_features (feature_id, user_id, status) VALUES`;
                        let featureStatus;
                        let featureResult;
                        for (const element of featureData) {
                            // if (packageId === 18) {
                            //     if (element.id === 1 || element.id === 2 || element.id === 3 || element.id === 5 || element.id === 6 || element.id === 8 || element.id === 10 ||element.id === 11 || element.id === 13 || element.id === 14 || element.id === 15) {
                            //         featureStatus = 1;
                            //     } else {
                            //         featureStatus = 0;
                            //     }
                            // } else {
                            //     if (element.id === 1 || element.id === 2 || element.id === 13 || element.id === 14 || element.id === 15) {
                            //         featureStatus = 1;
                            //     } else {
                            //         featureStatus = 0;
                            //     }
                            // }
                            if (element.id === 1 || element.id === 2 || element.id === 13 || element.id === 14 || element.id === 15) {
                                featureStatus = 1;
                            }
                            else {
                                featureStatus = 0;
                            }
                            addFeatures = addFeatures + `(${element.id},${rows.insertId},${featureStatus}), `;
                            featureResult = addFeatures.substring(0, addFeatures.lastIndexOf(','));
                        }
                        const [userFeatureData] = yield db_1.default.query(featureResult);
                        const updateCodeStatus = `UPDATE card_activation SET card_assign = '${development_1.default.ASSIGNEDStatus}' WHERE card_key = '${code}'`;
                        const [cardRows] = yield db_1.default.query(updateCodeStatus);
                    }
                    else {
                        parsedData[parseDataIndex].failedMessage = `Failed to insert`;
                        duplicateData.push(parsedData[parseDataIndex]);
                        continue;
                    }
                    let socialIndex = -1;
                    const columnsArrays = Object.keys(parsedData[parseDataIndex]);
                    console.log("columnsArray", columnsArrays);
                    try {
                        for (var _t = true, socialRows_1 = (e_3 = void 0, __asyncValues(socialRows)), socialRows_1_1; socialRows_1_1 = yield socialRows_1.next(), _h = socialRows_1_1.done, !_h;) {
                            _k = socialRows_1_1.value;
                            _t = false;
                            try {
                                const socialEle = _k;
                                socialIndex++;
                                try {
                                    // const insertQuery = `INSERT INTO vcard_social_sites (user_id, site_id, label, value, created_at) VALUES(?, ?, ?, ?, ?, ?)`
                                    for (var _u = true, columnsArrays_1 = (e_4 = void 0, __asyncValues(columnsArrays)), columnsArrays_1_1; columnsArrays_1_1 = yield columnsArrays_1.next(), _l = columnsArrays_1_1.done, !_l;) {
                                        _o = columnsArrays_1_1.value;
                                        _u = false;
                                        try {
                                            const columEle = _o;
                                            if (socialEle.name == columEle) {
                                                let socialValue = ele[columEle];
                                                console.log("socialValue", socialValue);
                                                insertSOcialQuery = insertSOcialQuery + `(${rows.insertId}, ${socialRows[socialIndex].id}, '${socialEle.name}', '${socialValue}', '${createdAt}'), `;
                                                socialResult = insertSOcialQuery.substring(0, insertSOcialQuery.lastIndexOf(','));
                                            }
                                        }
                                        finally {
                                            _u = true;
                                        }
                                    }
                                }
                                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                                finally {
                                    try {
                                        if (!_u && !_l && (_m = columnsArrays_1.return)) yield _m.call(columnsArrays_1);
                                    }
                                    finally { if (e_4) throw e_4.error; }
                                }
                            }
                            finally {
                                _t = true;
                            }
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (!_t && !_h && (_j = socialRows_1.return)) yield _j.call(socialRows_1);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }
                finally {
                    _s = true;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_s && !_e && (_f = parsedData_1.return)) yield _f.call(parsedData_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        console.log("socialResult", socialResult);
        if (socialResult != undefined && socialResult != null) {
            const [insertSocialData] = yield db_1.default.query(socialResult);
            // console.log("insertSocialData", insertSocialData);
        }
        console.log("duplicateData", duplicateData);
        if (duplicateData.length > 0) {
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('Failed Users');
            worksheet.columns = [
                { key: 'username', header: 'username' },
                { key: 'name', header: 'name' },
                { key: 'email', header: 'email' },
                { key: 'dial_code', header: 'dial_code' },
                { key: 'phone', header: 'phone' },
                { key: 'country', header: 'country' },
                { key: 'code', header: 'code' },
                { key: 'failedMessage', header: 'failedMessage' },
            ];
            try {
                for (var _v = true, duplicateData_1 = __asyncValues(duplicateData), duplicateData_1_1; duplicateData_1_1 = yield duplicateData_1.next(), _p = duplicateData_1_1.done, !_p;) {
                    _r = duplicateData_1_1.value;
                    _v = false;
                    try {
                        const iterator = _r;
                        const failedData = [iterator.username, iterator.name, iterator.email, iterator.dial_code, iterator.phone, iterator.country, iterator.code, iterator.failedMessage];
                        worksheet.addRow(failedData);
                    }
                    finally {
                        _v = true;
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (!_v && !_p && (_q = duplicateData_1.return)) yield _q.call(duplicateData_1);
                }
                finally { if (e_5) throw e_5.error; }
            }
            const exportPath = path_1.default.resolve(__dirname, `failedUsers.xlsx`);
            yield workbook.xlsx.writeFile(exportPath);
            worksheet.columns.forEach((sheetColumn) => {
                sheetColumn.font = {
                    size: 12,
                };
                sheetColumn.width = 30;
            });
            worksheet.getRow(1).font = {
                bold: true,
                size: 13,
            };
            var excelBucket = new aws_sdk_1.default.S3({
                credentials,
                params: {
                    Bucket: bucketName
                }
            });
            excelBucket.upload({
                // ACL: 'public-read', 
                Body: fs_1.default.createReadStream(exportPath),
                Key: `${duplicateData.length}failedUsers${createdAt}.xlsx`, // file upload by below name
                // ContentType: 'application/octet-stream' // force download if it's accessed as a top location
            }, (err, response) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    console.log(err);
                    return apiResponse.errorMessage(res, 400, "Failed!, Please Try again");
                }
                if (response) {
                    fs_1.default.unlink(exportPath, (err) => {
                        if (err)
                            throw err; //handle your error the way you want to;
                        console.log('file was deleted'); //or else the file will be deleted
                    });
                    fs_1.default.unlink(file.path, (err) => {
                        if (err)
                            throw err; //handle your error the way you want to;
                        console.log('file was deleted'); //or else the file will be deleted
                    });
                }
                console.log(response.Location);
                return apiResponse.successResponse(res, "Data Insert successfully, but some user are not inserted that is here", response.Location);
            }));
        }
        else {
            return apiResponse.successResponse(res, "Users inserted successfully", '');
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.importUser = importUser;
// ====================================================================================================
// ====================================================================================================
const importSampleFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const excelUrl = 'https://imagefurb.s3.ap-south-1.amazonaws.com/staticFiles/vkImportSampleFile.xlsx';
        return apiResponse.successResponse(res, "Data Retrieved Successfully", excelUrl);
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.importSampleFile = importSampleFile;
// ====================================================================================================
// ===================================================================================================
//not used
const exportUserOld = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const sql1 = `INSERT INTO tableName (Circle Name, Region Name, Division Name, Office Name, Pincode, OfficeType, Delivery, District, StateName) VALUES ('Andhra Pradesh Circle', 'Kurnool Region', 'Anantapur Division', 'A Narayanapuram B.O', '515004', 'BO', 'Delivery', 'ANANTHAPUR', 'Andhra Pradesh');
`;
        // type data = {
        //     user_id: number;
        //     username: string;
        //     full_name: string;
        //     email: string;
        //     phone: string;
        //     website: string;
        //     designation: string;
        //     company_name:string;
        //   };
        const sql = `SELECT id as user_id, username, name, email, phone, designation, website, company_name FROM users WHERE admin_id = ${userId} ORDER BY username asc`;
        const [rows] = yield db_1.default.query(sql);
        const workbook = new exceljs_1.default.Workbook();
        const worksheet = workbook.addWorksheet('User Detail');
        worksheet.columns = [
            { key: 'user_id', header: 'User Id' },
            { key: 'username', header: 'username' },
            { key: 'name', header: 'Full Name' },
            { key: 'email', header: 'Email' },
            { key: 'phone', header: 'Phone' },
            { key: 'designation', header: 'Designation' },
            { key: 'website', header: 'Website' },
            { key: 'company_name', header: 'Company Name' },
        ];
        rows.forEach((element) => {
            const data = [element.user_id, element.username, element.name, element.email, element.phone, element.designation, element.website, element.company_name];
            worksheet.addRow(data);
            console.log("data", data);
        });
        const exportPath = path_1.default.resolve(__dirname, `users${userId}.xlsx`);
        console.log(exportPath);
        yield workbook.xlsx.writeFile(exportPath);
        worksheet.columns.forEach((sheetColumn) => {
            sheetColumn.font = {
                size: 12,
            };
            sheetColumn.width = 30;
        });
        worksheet.getRow(1).font = {
            bold: true,
            size: 13,
        };
        console.log("exportPath", exportPath);
        const newExportPath = fs_1.default.createReadStream('./Screenshot 2023-03-02 212441.png');
        console.log('newExportPath', newExportPath);
        let result;
        const fileStream = fs_1.default.createReadStream(newExportPath);
        console.log("fileStream", fileStream);
        let form = new form_data_1.default();
        form.append('file', newExportPath);
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
        };
        console.log("form", form);
        yield axios_1.default.post('https://vkardz.com/api/uploadFile.php', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
            console.log("response.data", response.data);
            return apiResponse.successResponse(res, "Exported Successfully", response.data);
        })
            .catch(error => {
            console.error(error);
        });
        // form.append('extractArchive', 'false');
        //         let investorExist_response = await axios.post(
        //             'https://vkardz.com/api/uploadFile.php',
        //             form,
        //             {
        //               headers: {
        //                 // "Content-Type": "multipart/form-data",
        //                 "Content-Type": "application/x-www-form-urlencoded"
        //               },
        //             }
        //           );
        //           console.log("investorExist_response", investorExist_response);
        //           console.log("investorExist_response.data", investorExist_response.data);
        //   res.send("done");
        //   return        
        // console.log("form", form);
        // const response = await axios({   
        //     'post',
        //     url: `https://vkardz.com/api/uploadFile.php`,
        //     data: "",
        // });
        // result = response.data;
        // let header = form.getHeaders()
        // console.log("header", header);
        /*
                await axios.post('https://vkardz.com/api/uploadFile.php', form, {
                    // headers: {"content-type": "multipart/form-data"},
                    // headers: { "content-type": "application/x-www-form-urlencoded" },
                    headers: form.getHeaders()
        
                    // headers: form.getHeaders()
                    // headers: {"content-type": "multipart/form-data"}
                })
                    .then((response) => {
                        console.log("response.data", response.data);
                        result = response.data;
                    })
                    .catch((error) => {
                        console.log("error", error);
                        result = false;
                    });
        */
        // let result:any = utility.uploadFile(exportPath);
        // console.log("result", result);
        // if (result === false) {
        //     return apiResponse.errorMessage(res, 400, "Failed to generate excel, try again");
        // } 
        // fs.unlink(exportPath, (err) => {
        //     if (err) throw err //handle your error the way you want to;
        //     console.log('file was deleted');//or else the file will be deleted
        // });
        // return apiResponse.successResponse(res, "Exported Successfully", result);
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.exportUserOld = exportUserOld;
// ====================================================================================================
// ====================================================================================================
// ====================================================================================================
// ====================================================================================================
