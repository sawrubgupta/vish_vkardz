"use strict";
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
exports.base64ImgUpload = exports.uploadFile = exports.jwtGenerate = exports.sendTestMail = exports.sendHtmlMail = exports.sendMail = exports.extendedDateWithFormat = exports.extendedDateAndTime = exports.getTimeAndDate = exports.dateWithFormat = exports.validateEmail = exports.englishCheck = exports.urlValidation = exports.randomNumber = exports.randomString = exports.maxChecker = void 0;
const moment_1 = __importDefault(require("moment"));
const nodemailer_1 = __importDefault(require("nodemailer"));
require("moment-timezone");
const development_1 = __importDefault(require("../config/development"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const secretKey = development_1.default.secretKey; //process.env.SECRET;
const axios_1 = __importDefault(require("axios"));
let bucketName = process.env.BUCKET_NAME;
const development_2 = __importDefault(require("../config/development"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const credentials = development_2.default.AWS;
let s3 = new aws_sdk_1.default.S3({
    credentials
});
const maxChecker = (vari, count) => {
    if (vari.length > count) {
        return true;
    }
    else {
        return false;
    }
};
exports.maxChecker = maxChecker;
// ====================================================================================================
// ====================================================================================================
function randomString(length) {
    var text = "";
    var possibleChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    for (var i = 0; i < length; i++) {
        var sup = Math.floor(Math.random() * possibleChar.length);
        text += i > 0 && sup == i ? "0" : possibleChar.charAt(sup);
    }
    return text;
}
exports.randomString = randomString;
// ====================================================================================================
// ====================================================================================================
function randomNumber(length) {
    var text = "";
    var possibleChar = "123456789";
    for (var i = 0; i < length; i++) {
        var sup = Math.floor(Math.random() * possibleChar.length);
        text += i > 0 && sup == i ? "0" : possibleChar.charAt(sup);
    }
    return Number(text);
}
exports.randomNumber = randomNumber;
// ====================================================================================================
// ====================================================================================================
const urlValidation = (url) => {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    console.log(url);
    if (url.startsWith("https://" || "http://")) {
        return url;
    }
    else {
        console.log("http", "https://" + url);
        return "https://" + url;
    }
    // if (urlPattern.test(url)) {		
    // 	return urlPattern.test(url);
    // } else {
    // 	return `https://${url}`;
    // 	console.log("http", `https://${url}`);
    // }
};
exports.urlValidation = urlValidation;
// ====================================================================================================
// ====================================================================================================
const englishCheck = (english) => {
    var myRegEx = /[^A-Za-z\d]/;
    if (myRegEx.test(english)) {
        //string contains only letters from the English alphabet
        return `The ${english} field contains only letters from the English alphabet.`;
    }
    else {
        return "";
    }
};
exports.englishCheck = englishCheck;
// ====================================================================================================
// ====================================================================================================
const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};
exports.validateEmail = validateEmail;
// ====================================================================================================
// ====================================================================================================
const dateWithFormat = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear());
    const goodDate = (0, moment_1.default)(date).tz('Asia/Kolkata').format("YYYY-MM-DD HH:mm:ss");
    return goodDate;
};
exports.dateWithFormat = dateWithFormat;
// ====================================================================================================
// ====================================================================================================
const getTimeAndDate = () => __awaiter(void 0, void 0, void 0, function* () {
    var m = moment_1.default.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm');
    const str = (m).toString().split(" ");
    return [str[0], str[1]];
});
exports.getTimeAndDate = getTimeAndDate;
// ====================================================================================================
// ====================================================================================================
const extendedDateAndTime = (type) => {
    const date = new Date();
    var endDate = "0000-00-00 00:00:00";
    if (type === "yearly" || type === "year") {
        date.setFullYear(date.getFullYear() + 1);
        endDate = (0, moment_1.default)(date).tz('Asia/Kolkata').format("YYYY-MM-DD HH:mm:ss");
    }
    else if (type === "monthly" || type === "trial" || type === "month") {
        date.setMonth(date.getMonth() + 1);
        endDate = (0, moment_1.default)(date).tz('Asia/Kolkata').format("YYYY-MM-DD HH:mm:ss");
    }
    else if (type === "weekly" || type === "week") {
        date.setDate(date.getDate() + 7);
        endDate = (0, moment_1.default)(date).tz('Asia/Kolkata').format("YYYY-MM-DD HH:mm:ss");
    }
    const str = (endDate).toString().split(" ");
    return [str[0], str[1]];
};
exports.extendedDateAndTime = extendedDateAndTime;
// ====================================================================================================
// ====================================================================================================
const extendedDateWithFormat = (type) => {
    const date = new Date();
    var endDate = "0000-00-00 00:00:00";
    if (type === "yearly" || type === "year") {
        date.setFullYear(date.getFullYear() + 1);
        endDate = (0, moment_1.default)(date).tz('Asia/Kolkata').format("YYYY-MM-DD HH:mm:ss");
    }
    else if (type === "monthly" || type === "trial" || type === "month") {
        date.setMonth(date.getMonth() + 1);
        endDate = (0, moment_1.default)(date).tz('Asia/Kolkata').format("YYYY-MM-DD HH:mm:ss");
    }
    else if (type === "weekly" || type === "week") {
        date.setDate(date.getDate() + 7);
        endDate = (0, moment_1.default)(date).tz('Asia/Kolkata').format("YYYY-MM-DD HH:mm:ss");
    }
    return endDate;
};
exports.extendedDateWithFormat = extendedDateWithFormat;
// ====================================================================================================
// ====================================================================================================
const sendMail = (email, subject, message) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        var transport = nodemailer_1.default.createTransport({
            // host: "mail.office365.com",
            service: "gmail",
            // port: 465,
            auth: {
                user: "vkardzinfo@gmail.com",
                pass: "cmwp cahr iysd lndl" //"kokvjhmsplezxfva"
            }
        });
        // create reusable transporter object using the default SMTP transport
        // let transporter = nodemailer.createTransport(config.smtp);
        // send mail with defined transport object
        let info = yield transport.sendMail({
            from: "noreply@vkardz.com",
            to: email,
            subject: subject,
            text: message,
            html: "", // html body
        });
        result = info.messageId;
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer_1.default.getTestMessageUrl(info));
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }
    catch (err) {
        console.log("error", err);
        result = false;
        throw err;
    }
    return result;
});
exports.sendMail = sendMail;
// ====================================================================================================
// ====================================================================================================
const sendHtmlMail = (email, subject, htmlData) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        // var transport = nodemailer.createTransport({
        // 	service: "gmail",
        // 	auth: {
        // 		user: "vkardzinfo@gmail.com",
        // 		pass: "cmwp cahr iysd lndl"
        // 	}
        // });
        // 		SMTP_USER=AKIAQZXG2JBKUM2Z3EZ2#noreply@vkardz.com 
        // SMTP_PASSWORD=BE+Cu1M+zj/D+xiQGjTxWoQnRNYaOdEuIqkDSiL9LGXk#7)W}(-$8-yz$ 
        let transport = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST || "email-smtp.ap-southeast-1.amazonaws.com",
            port: 587,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD //"c97415c511447f"
            }
        });
        // send mail with defined transport object
        let info = yield transport.sendMail({
            from: "happiness@vkardz.com",
            to: email,
            subject: subject,
            html: htmlData, // html body
        });
        result = info.messageId;
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer_1.default.getTestMessageUrl(info));
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }
    catch (err) {
        console.log("error", err);
        result = false;
        throw err;
    }
    return result;
});
exports.sendHtmlMail = sendHtmlMail;
// ====================================================================================================
// ====================================================================================================
const sendTestMail = (email, subject, message) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer_1.default.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "8bda4d0a0a1b34",
                pass: "c97415c511447f"
            }
        });
        // send mail with defined transport object
        let info = yield transporter.sendMail({
            from: "noreply@vkardz.com",
            to: email,
            subject: subject,
            text: message,
            html: "", // html body
        });
        result = info.messageId;
        console.log("Message sent: %s", info);
        console.log("Preview URL: %s", nodemailer_1.default.getTestMessageUrl(info));
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }
    catch (err) {
        console.log("error", err);
        result = false;
        throw err;
    }
    return result;
});
exports.sendTestMail = sendTestMail;
// ====================================================================================================
// ====================================================================================================
const jwtGenerate = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let token = jsonwebtoken_1.default.sign({ userId: id }, secretKey, {
        expiresIn: "30d", // expires in 24 hours
    });
    return token;
});
exports.jwtGenerate = jwtGenerate;
// ====================================================================================================
// ====================================================================================================
const uploadFile = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    let result = false;
    try {
        // const response = await axios({
        //     url: `https://vkardz.com/api/qrCode.php?username=${username}`,
        //     method: "get",
        // });
        yield axios_1.default.post('https://vkardz.com/api/uploadFile.php', {
            type: 'file',
            lastName: filePath
        })
            .then(function (response) {
            console.log(response);
            result = response;
        })
            .catch(function (error) {
            console.log(error);
            result = false;
        });
        return result;
    }
    catch (error) {
        result = false;
        return result;
    }
});
exports.uploadFile = uploadFile;
// ====================================================================================================
// ====================================================================================================
// export const imageUpload =async () => {
// 	const upload = multer({
// 		storage: multerS3({
// 			s3: s3,
// 			bucket: bucketName, 
// 			metadata: function (req, file, cb) {
// 				cb(null, { fieldName: file.fieldname });
// 			},
// 			contentType: multerS3.AUTO_CONTENT_TYPE,
// 			key: async (req: Request, file, cb) => {
// 				let type = req.body.type;
// 				if (type === "1") {
// 					cb(null, 'uploads/blogs/' + file.originalname)
// 				} else if (type === "company") {
// 					cb(null, 'uploads/company_logo/' + file.originalname)
// 				} else if (type === "custom") {
// 					cb(null, 'uploads/custom-logo/' + file.originalname)
// 				} else if (type === "customize_file") {
// 					cb(null, 'uploads/customize_file/' + file.originalname)
// 				} else if (type === "files") {
// 					cb(null, 'uploads/files/' + file.originalname)
// 				} else if (type === "portfolio") {
// 					cb(null, 'uploads/portfolio/' + file.originalname)
// 				} else if (type === "profile") {
// 					cb(null, 'uploads/profile/' + file.originalname)
// 				} else if (type === "qrcode") {
// 					cb(null, 'uploads/qrcode/' + file.originalname)
// 				} else if (type === "rating") {
// 					cb(null, 'uploads/rating/' + file.originalname)
// 				} else if (type === "reviews") {
// 					cb(null, 'uploads/reviews/' + file.originalname)
// 				} else if (type === "services") {
// 					cb(null, 'uploads/services/' + file.originalname)
// 				} else if (type === "thumb") {
// 					cb(null, 'uploads/thumb/' + file.originalname)
// 				} else if (type === "docfile") {
// 					cb(null, 'uploads/user_docfile/' + file.originalname)
// 				} else if (type === "vcard") {
// 					cb(null, 'uploads/vcard/' + file.originalname)
// 				} else {
// 					cb(null, 'uploads/' + file.originalname)
// 				} 
// 				// cb(null, 'vendorImage/'+file.originalname)
// 			}
// 		})
// 	})
// }
// ====================================================================================================
// ====================================================================================================
const base64ImgUpload = (type, file, imgName) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    return new Promise((resolve, reject) => {
        var imgBucket = new aws_sdk_1.default.S3({
            credentials,
            params: {
                Bucket: bucketName
            }
        });
        const imgBuffer = Buffer.from(file.split(',')[1], 'base64');
        const img = imgName.split("https://vkardz.com/");
        const path = 'uploads/' + type + '/' + imgName + '.png';
        imgBucket.upload({
            // ACL: 'public-read', 
            Body: imgBuffer,
            Key: path,
            ContentType: 'image/png',
        }, (err, response) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log(err);
                reject(false);
            }
            ;
            // result = {imgUrl: response.Location, data: path};
            result = response.Location;
            resolve(path);
        }));
    });
    //return word;
    // return result;
});
exports.base64ImgUpload = base64ImgUpload;
// ====================================================================================================
// ====================================================================================================
