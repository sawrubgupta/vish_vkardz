import moment from "moment";
import nodemailer from "nodemailer";
import 'moment-timezone';
import config from "../config/development";
import jwt from "jsonwebtoken";
import 'dotenv/config';
const secretKey: any = config.secretKey; //process.env.SECRET;
import axios from 'axios';

import multerS3 from "multer-s3";
let bucketName: any = process.env.BUCKET_NAME;
import configs from '../config/development';
import AWS from 'aws-sdk';
import multer from "multer";
import { Request, Response } from "express";

const credentials: any = configs.AWS;

let s3: any = new AWS.S3({
	credentials
});

export const maxChecker = (vari: string, count: number) => {
	if (vari.length > count) {
		return true;
	} else {
		return false;
	}
};

// ====================================================================================================
// ====================================================================================================

export function randomString(length: number) {
	var text = "";
	var possibleChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
	for (var i = 0; i < length; i++) {
		var sup = Math.floor(Math.random() * possibleChar.length);
		text += i > 0 && sup == i ? "0" : possibleChar.charAt(sup);
	}
	return text;
}

// ====================================================================================================
// ====================================================================================================

export function randomNumber(length: number) {
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

export const urlValidation = (url:any) => {
	const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
	console.log(url);

	if (url.startsWith("https://" || "http://")) {
        return url;
    } else {
		console.log("http", "https://" + url);
        return "https://" + url;
		
    }

	// if (urlPattern.test(url)) {		
	// 	return urlPattern.test(url);
	// } else {
	// 	return `https://${url}`;
	// 	console.log("http", `https://${url}`);
		
	// }
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
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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

export const getTimeAndDate = async () => {
	var m = moment.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm');
	const str = (m).toString().split(" ");
	return [str[0], str[1]];
}

// ====================================================================================================
// ====================================================================================================

export const extendedDateAndTime = (type: string) => {
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
	const str = (endDate).toString().split(" ");

	return [str[0], str[1]];
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
	let result: any;

	try {
		var transport = nodemailer.createTransport({
			// host: "mail.office365.com",
			service: "gmail",
			// port: 465,
			auth: {
				user: "vkardzinfo@gmail.com",      //"vishalpathriya63@gmail.com",
				pass: "cmwp cahr iysd lndl"      //"kokvjhmsplezxfva"
			}
		});
		// create reusable transporter object using the default SMTP transport
		// let transporter = nodemailer.createTransport(config.smtp);
		
		// send mail with defined transport object
		let info = await transport.sendMail({
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
		console.log("error", err);
		result = false;
		throw err;
	}
	return result;
};

// ====================================================================================================
// ====================================================================================================

export const sendHtmlMail = async (email: string, subject: string, htmlData:any) => {
	let result: any;

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

		let transport = nodemailer.createTransport({
			host: process.env.SMTP_HOST || "email-smtp.ap-southeast-1.amazonaws.com", //"sandbox.smtp.mailtrap.io",
			port: 587,
			auth: {
				user: process.env.SMTP_USER,//"8bda4d0a0a1b34",
				pass: process.env.SMTP_PASSWORD //"c97415c511447f"
			}
		});

		// send mail with defined transport object
		let info = await transport.sendMail({
			from: "happiness@vkardz.com", // sender address
			to: email, // list of receivers
			subject: subject, // Subject line
			html: htmlData, // html body
		})
		result = info.messageId;

		console.log("Message sent: %s", info.messageId);
		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
	} catch (err) {
		console.log("error", err);
		result = false;
		throw err;
	}
	return result;
};

// ====================================================================================================
// ====================================================================================================

export const sendTestMail = async (email: string, subject: string, message: string) => {
	let result: any;

	try {
		// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			host: "sandbox.smtp.mailtrap.io",
			port: 2525,
			auth: {
				user: "8bda4d0a0a1b34",
				pass: "c97415c511447f"
			}
		});
		// send mail with defined transport object
		let info = await transporter.sendMail({
			from: "noreply@vkardz.com", // sender address
			to: email, // list of receivers
			subject: subject, // Subject line
			text: message, // plain text body
			html: "", // html body
		})
		result = info.messageId;

		console.log("Message sent: %s", info);
		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
	} catch (err) {
		console.log("error", err);
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

export const uploadFile = async (filePath: string) => {
	let result: any = false;
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

export const base64ImgUpload = async (type: string, file: any, imgName: string) => {
	let result: any;
	return new Promise((resolve, reject) => {
		var imgBucket: any = new AWS.S3({
			credentials,
			params: {
				Bucket: bucketName
			}
		})
		const imgBuffer = Buffer.from(file.split(',')[1], 'base64');

		const img = imgName.split("https://vkardz.com/");

		const path = 'uploads/' + type + '/' + imgName + '.png';
		imgBucket.upload({
			// ACL: 'public-read', 
			Body: imgBuffer,
			Key: path, // file upload by below name
			ContentType: 'image/png',
		}, async (err: any, response: any) => {
			if (err) {
				console.log(err);
				reject(false);
			};

			// result = {imgUrl: response.Location, data: path};
			result = response.Location;
			resolve(path);
		});

	})





	//return word;
	// return result;
}

// ====================================================================================================
// ====================================================================================================
