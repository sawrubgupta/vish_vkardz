import moment from "moment";
import nodemailer from "nodemailer";
import 'moment-timezone';
import config from "../config/development";
import jwt from "jsonwebtoken";
import 'dotenv/config';
const secretKey:any = config.secretKey; //process.env.SECRET;
import axios from 'axios';

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

export function randomNumber (length: number) {
	var text = "";
	var possibleChar = "123456789";
	for (var i = 0; i < length; i++) {
		var sup = Math.floor(Math.random() * possibleChar.length);
		text += i > 0 && sup == i ? "0" : possibleChar.charAt(sup);
	}
	return Number(text);
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
	const goodDate = moment(date).tz('Asia/Kolkata').format("YYYY-MM-DD HH:mm:ss");
	return goodDate;
};

// ====================================================================================================
// ====================================================================================================

export const extendedDateWithFormat = (type: string) => {
	const date = new Date();
	var endDate = "0000-00-00 00:00:00";
	if (type === "yearly" || type === "year") {
		date.setFullYear(date.getFullYear() + 1);
		endDate = moment(date).tz('Asia/Kolkata').format("YYYY-MM-DD HH:mm:ss");
	} else if (type === "monthly" || type === "trial" || type === "month") {
		date.setMonth(date.getMonth() + 1);
		endDate = moment(date).tz('Asia/Kolkata').format("YYYY-MM-DD HH:mm:ss");
	} else if (type === "weekly" || type === "week") {
		date.setDate(date.getDate() + 7);
		endDate = moment(date).tz('Asia/Kolkata').format("YYYY-MM-DD HH:mm:ss");
	}
	return endDate;
};

// ====================================================================================================
// ====================================================================================================

export const sendMail = async (email: string, subject: string, message: string) => {
	let result:any;

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
		})
		result = info.messageId;
		
		console.log("Message sent: %s", info.messageId);
		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
	} catch (err) {
		console.log("error",err);
		result = false;
		throw err;
	}
	return result;
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

export const uploadFile =async (filePath:string) => {
    let result:any = false;
    try {
        // const response = await axios({
        //     url: `https://vkardz.com/api/qrCode.php?username=${username}`,
        //     method: "get",
        // });
		await axios.post('https://vkardz.com/api/uploadFile.php', {
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
    } catch (error) {
      result = false;
      return result;
    }
}

// ====================================================================================================
// ====================================================================================================
