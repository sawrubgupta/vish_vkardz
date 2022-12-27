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
exports.jwtGenerate = exports.sendMail = exports.extendedDateWithFormat = exports.dateWithFormat = exports.validateEmail = exports.englishCheck = exports.randomString = exports.maxChecker = void 0;
const moment_1 = __importDefault(require("moment"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const development_1 = __importDefault(require("../config/development"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const secretKey = development_1.default.secretKey; //process.env.SECRET;
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
    var possibleChar = "abcdefghijklmnopqrstuvwxyz1234567890";
    for (var i = 0; i < length; i++) {
        var sup = Math.floor(Math.random() * possibleChar.length);
        text += i > 0 && sup == i ? "0" : possibleChar.charAt(sup);
    }
    return text;
}
exports.randomString = randomString;
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
    const goodDate = (0, moment_1.default)(date).format("YYYY-MM-DD HH:mm:ss");
    return goodDate;
};
exports.dateWithFormat = dateWithFormat;
// ====================================================================================================
// ====================================================================================================
const extendedDateWithFormat = (type) => {
    const date = new Date();
    var endDate = "0000-00-00 00:00:00";
    if (type === "yearly" || type === "year") {
        date.setFullYear(date.getFullYear() + 1);
        endDate = (0, moment_1.default)(date).format("YYYY-MM-DD HH:mm:ss");
    }
    else if (type === "monthly" || type === "trial" || type === "month") {
        date.setMonth(date.getMonth() + 1);
        endDate = (0, moment_1.default)(date).format("YYYY-MM-DD HH:mm:ss");
    }
    return endDate;
};
exports.extendedDateWithFormat = extendedDateWithFormat;
// ====================================================================================================
// ====================================================================================================
const sendMail = (email, subject, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer_1.default.createTransport(development_1.default.smtp);
        // send mail with defined transport object
        let info = yield transporter.sendMail({
            from: "noreply@vkardz.com",
            to: email,
            subject: subject,
            text: message,
            html: "", // html body
        });
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer_1.default.getTestMessageUrl(info));
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }
    catch (err) {
        console.log("djdn", err);
        throw err;
    }
});
exports.sendMail = sendMail;
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
