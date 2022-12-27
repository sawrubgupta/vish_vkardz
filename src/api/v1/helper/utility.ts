import moment from "moment";
import nodemailer from "nodemailer";
import config from "../config/development";
import jwt from "jsonwebtoken";
import 'dotenv/config';
const secretKey:any = config.secretKey; //process.env.SECRET;

export const maxChecker = (vari: string, count: number) => {
	if (vari.length > count) {
		return true;
	} else {
		return false;
	}
};

// ====================================================================================================
// ====================================================================================================

export function randomString (length: number) {
	var text = "";
	var possibleChar = "abcdefghijklmnopqrstuvwxyz1234567890";
	for (var i = 0; i < length; i++) {
		var sup = Math.floor(Math.random() * possibleChar.length);
		text += i > 0 && sup == i ? "0" : possibleChar.charAt(sup);
	}
	return text;
}

// ====================================================================================================
// ====================================================================================================

export const englishCheck = (english: any) => {
	var myRegEx = /[^A-Za-z\d]/;
	if (myRegEx.test(english)) {
		//string contains only letters from the English alphabet
		return `The ${english} field contains only letters from the English alphabet.`;
	} else {
		return "";
	}
};

// ====================================================================================================
// ====================================================================================================

export const validateEmail = (email: any) => {
	const re =/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
};

// ====================================================================================================
// ====================================================================================================

export const dateWithFormat = () => {
	const date = new Date();
	date.setFullYear(date.getFullYear());
	const goodDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
	return goodDate;
};

// ====================================================================================================
// ====================================================================================================

export const extendedDateWithFormat = (type: string) => {
	const date = new Date();
	var endDate = "0000-00-00 00:00:00";
	if (type === "yearly" || type === "year") {
		date.setFullYear(date.getFullYear() + 1);
		endDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
	} else if (type === "monthly" || type === "trial" || type === "month") {
		date.setMonth(date.getMonth() + 1);
		endDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
	}
	return endDate;
};

// ====================================================================================================
// ====================================================================================================

export const sendMail = async (email: string, subject: string, message: string) => {
	try {
		// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport(config.smtp);
		// send mail with defined transport object
		let info = await transporter.sendMail({
			from: "noreply@vkardz.com", // sender address
			to: email, // list of receivers
			subject: subject, // Subject line
			text: message, // plain text body
			html: "", // html body
		});
		
		console.log("Message sent: %s", info.messageId);
		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
	} catch (err) {
		console.log("djdn",err);
		throw err
	}
};

// ====================================================================================================
// ====================================================================================================

export const jwtGenerate = async (id: string) => {
	let token = jwt.sign({ userId: id }, secretKey, {
		expiresIn: "30d", // expires in 24 hours
	});
	return token;
};

// ====================================================================================================
// ====================================================================================================
