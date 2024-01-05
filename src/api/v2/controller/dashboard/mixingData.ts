import { Request, Response } from "express";
import pool from '../../../../dbV2';
import * as apiResponse from "../../helper/apiResponse";
import config from '../../config/development';
import nodemailer from 'nodemailer';

export const mixingData = async (req: Request, res: Response) => {
    try {
        const geturls = `SELECT * FROM app_setting WHERE status = 1`;
        const [url]: any = await pool.query(geturls);

        const appVersionQuery = `SELECT * FROM app_update LIMIT 1`;
        const [appVersionData]: any = await pool.query(appVersionQuery);

        const limitationSql = `SELECT * FROM user_limitations WHERE status = 1`;
        const [limitationRows]: any = await pool.query(limitationSql);

        const appVersionRows: object = {
            android: {
                forceUpdate: appVersionData[0].force_android_update,
                packageName: appVersionData[0].description,
                launchUrl: appVersionData[0].android_url,
                versionName: appVersionData[0].android_version,
                versionCode: appVersionData[0].android_code,
                isRequired: appVersionData[0].is_required,
            },
            ios: {
                forceUpdate: appVersionData[0].force_ios_update,
                packageName: appVersionData[0].description,
                launchUrl: appVersionData[0].ios_url,
                versionName: appVersionData[0].ios_version,
                versionCode: appVersionData[0].ios_code,
                isRequired: appVersionData[0].is_required,
            }
        }

        const limitationData: any = {
            // product: 50,
            // gallery: 50,
            // profile: 5
        }

        const customUrls = {
            imgUrl: "https://vkardz.s3.ap-south-1.amazonaws.com/",
            siteUrl: config.vkardUrl
        }

        for (const ele of limitationRows) {
            // if (ele.type === config.productType) limitationData['product'] = ele.limitation;
            // if (ele.type === config.galleryType) limitationData['gallery'] = ele.limitation;
            // if (ele.type === config.profileType) limitationData['profile'] = ele.limitation;
            limitationData[ele.type] = ele.limitation;
            continue;
        }

        const secretKeys = {
            razorPayKey: process.env.RAZORPAY_KEY,
        }


        const imageResolution = {
            "profileImage": {
                "type": "circular",
                "height": 150,
                "width": 150,
                "quality": 50
            },
            "profileCoverImage": {
                "type": "rect",
                "height": 200,
                "width": 750,
                "quality": 50
            },
            "productImage": {
                "type": "rect",
                "height": 500,
                "width": 300,
                "quality": 50
            },
            "galleryImage": {
                "type": "rect",
                "height": 750,
                "width": 750,
                "quality": 50
            },
            "aboutUsCoverImage": {
                "type": "rect",
                "height": 200,
                "width": 750,
                "quality": 50
            },
            "aboutUsProfileImage": {
                "type": "circular",
                "height": 150,
                "width": 150,
                "quality": 50
            }
        }

        // return apiResponse.successResponse(res, "Data Retrieved Successfully", data);\
        return res.status(200).json({
            status: true,
            url, appVersionRows, limitationData, customUrls, secretKeys, imageResolution,
            message: "Data Retrieved Successfully"
        })

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const test = async (req: Request, res: Response) => {
    try {

        //   const transporter = nodemailer.createTransport({
        //     name: "mail.lookingforjob.co",
        //         host: "mail.lookingforjob.co",
        //         port: 465,
        //         auth: {
        //           user: "mailto:info@lookingforjob.co",
        //           pass: "asd12300"
        //         },
        //   });

        //   const mailOptions = {
        //     from: "mailto:info@lookingforjob.co",
        //     to: email,
        //     name: email,
        //     subject: `${subject}`,
        //     text: `name is ${name} and phoneNumber is ${phone} and message is ${message}`,
        //   };

        var transport = nodemailer.createTransport({
            // host: "mail.office365.com",
            service: "gmail",
            // port: 465,
            auth: {
                user: "vkardzinfo@gmail.com",      //"vishalpathriya63@gmail.com",
                pass: "cmwp cahr iysd lndl"      //"kokvjhmsplezxfva"
            }
        });
        //   console.log("transport ", transport);

        let info = await transport.sendMail({
            from: "noreply@vkardz.com", // sender address
            to: "vishalpathriya9252@gmail.com", // list of receivers
            subject: "subject", // Subject line
            text: "message", // plain text body
        })
        // result = info.messageId;

        console.log("Message sent: %s", info);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        //   transporter.sendMail(mailOptions, (error:any, info:any) => {
        // let info = await transporter.sendMail({
        //     from: "noreply@vkardz.com", // sender address
        //     to: "vishalpathriya9252@gmail.com", // list of receivers
        //     subject: "subject", // Subject line
        //     text: "message", // plain text body
        // })

        return res.status(200).json({
            status: true,
            data: null,
            message: "Data Retrieved Successfully"
        })

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================

export const apiTest = async (req: Request, res: Response) => {
    try {
        // Define your API endpoint
        const apiUrl = 'https://api.example.com/data';

        // Function to make the API call
        function makeApiCall() {
            // Use your preferred method for making API calls (e.g., fetch, axios, etc.)
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    // Handle the API response data here
                    console.log("api call", data);
                })
                .catch(error => {
                    // Handle errors
                    console.error('Error making API call:', error);
                });
        }

        // Set up the loop with a 1-second interval
        const intervalId = setInterval(makeApiCall, 1000);

        // You can stop the loop after a certain number of iterations if needed
        // Uncomment the next line and replace 10 with the desired number of iterations
        // setTimeout(() => clearInterval(intervalId), 1000 * 10);


        // Call the function to start the loop

    } catch (e) {
        console.log(e);
        return apiResponse.somethingWentWrongMessage;
    }
}

// ====================================================================================================
// ====================================================================================================
