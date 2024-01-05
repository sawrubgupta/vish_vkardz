import { Request, Response } from "express";
import pool from "../../../../dbV2";
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config from "../../config/development";
import Excel from 'exceljs';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import xlsx from 'xlsx';
import { getQr, generateQr } from "../../../v2/helper/qrCode";
import md5 from "md5";
import AWS from 'aws-sdk';

const credentials: any = config.AWS;
const bucketName: any = config.BUCKET_NAME;

export const exportUser = async (req: Request, res: Response) => {
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
        const [rows]: any = await pool.query(sql);

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('User Detail');

        let columnsHeader: any = [
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
            const [socialRows]: any = await pool.query(sociaSiteSql);

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
                if (socialValue === null || socialValue === undefined) socialValue = '';
                data.push(`${socialValue}`)
            }

            const vcfSql = `SELECT value, type FROM vcf_custom_field WHERE user_id = ${element.user_id} AND status = 1`;
            const [vcfData]: any = await pool.query(vcfSql);

            let vcfIndex = -1;
            for await (const ele of vcfData) {
                vcfIndex++;
                columnsHeader.push({ key: 'value', header: 'Custom ' + ele.type });
                data.push(`${vcfData[vcfIndex].value}`)
            }

            worksheet.addRow(data);
            console.log("data", data);

        };


        const exportPath: any = path.resolve(__dirname, `users${userId}.xlsx`);
        console.log(exportPath);

        await workbook.xlsx.writeFile(exportPath);

        worksheet.columns.forEach((column) => {
            column.font = {
                size: 12,
            };
            // column.width = 100;
        });

        worksheet.getRow(1).font = {
            bold: true,
            size: 13,
        };
        console.log("exportPath", exportPath);

        var excelBucket: any = new AWS.S3({
            credentials,
            params: {
                Bucket: bucketName
            }
        })

        excelBucket.upload({
            // ACL: 'public-read', 
            Body: fs.createReadStream(exportPath),
            Key: 'corporate-admin/export-users/' + `records${createdAt}.xlsx`, // file upload by below name
            //   Key: 'invoices/' + 'invoice' + paymentId + ".pdf", // file upload by below name

            // ContentType: 'application/octet-stream' // force download if it's accessed as a top location
        }, async (err: any, response: any) => {
            if (err) {
                console.log(err);
                return apiResponse.errorMessage(res, 400, "Failed!, Please Try again");
            }
            if (response) {
                fs.unlink(exportPath, (err) => {
                    if (err) throw err //handle your error the way you want to;
                    console.log('file was deleted');//or else the file will be deleted
                });
            }
            console.log(response.Location);
            return apiResponse.successResponse(res, "Success", response.Location);
        });


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

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const importUser = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const createdAt = utility.dateWithFormat();

        const credentials: any = config.AWS;
        const bucketName: any = config.BUCKET_NAME;

        //columns which is in excel
        type data = {
            username: string,
            card_number: string,
            name: string,
            display_email: string,
            display_dial_code: string,
            display_number: string,
            company_name: string,
            designation: string,
            website: string,
            address: string,
            facebook_1: string,
            twitter_2: string,
            instagram_3: string,
            linkedin_4: string,
            youtube_5: string,
            whatsapp_6: string,
            amazon_24: string,
            ApplePay: string,
            Behance: string,
            Blogger: string,
            Clubhouse: string,
            Custom_Link: string,
            Discord: string,
            Dribble: string,
            Drive: string,
            Dropbox: string,
            Email: string,
            Evanto: string,
            Evernote: string,
            Fiver: string,
            Freelance: string,
            Github: string,
            Gmail: string,
            Google_plus: string,
            GooglePay: string,
            Keybase: string,
            Messenger: string,
            Line: string,
            Medium: string,
            Menu: string,
            Patreon: string,
            Paypal: string,
            Phone: string,
            Pinterest: string,
            Quora: string,
            Razorpay: string,
            Reddit: string,
            Rss: string,
            Skype: string,
            Slack: string,
            Sms: string,
            Snapchat: string,
            Soundcloud: string,
            Stripe: string,
            Telegram: string,
            Threema: string,
            Tiktok: string,
            Tumbler: string,
            Twitch: string,
            Upwork: string,
            Viber: string,
            Vimeo: string,
            Vine: string,
            Vk: string,
            Wechat: string,
            Zoom: string,
        }

        const justDate = utility.dateWithFormat();
        const endDate = utility.extendedDateWithFormat("yearly");
        const file: any = req.file;

        const fileData = xlsx.readFile(file.path); // Read the file using pathname        
        const sheetNames: any = fileData.SheetNames; // Grab the sheet info from the file
        const totalSheets: any = (sheetNames.length);

        let parsedData: any = []; // Variable to store our data 
        for (let i = 0; i < totalSheets; i++) { // Loop through sheets
            const tempData = xlsx.utils.sheet_to_json(fileData.Sheets[sheetNames[i]]);  // Convert to json using xlsx
            // tempData.shift(); // Skip header row which is the colum names or if want header use this..
            parsedData.push(...tempData); // Add the sheet's json to our data array
        }
        if (parsedData.length === 0) {
            return apiResponse.errorMessage(res, 400, "Empty rows!!")
        }

        console.log("parsedData", parsedData)
        const maxRecord: number = 50;
        if (parsedData.length >= maxRecord) {
            return apiResponse.errorMessage(res, 400, `You can't insert more than ${maxRecord} records!`);
        }

        // let insertQuery =  `INSERT INTO users(username, name, card_number, card_number_fix, email, dial_code, phone, country, password, login_time, account_type, start_date, end_date, post_time, created_at) VALUES `;

        const socialLinkSql = `SELECT id, name FROM social_sites WHERE status = 1`;
        const [socialRows]: any = await pool.query(socialLinkSql);

        let ele: any;
        let duplicateData: any = [];

        let insertSOcialQuery = `INSERT INTO vcard_social_sites (user_id, site_id, label, value, created_at) VALUES`;
        let socialResult: any = null;

        let parseDataIndex = -1;
        for await (ele of parsedData) {
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
            const profile_pin: number = ele.profile_pin;
            let is_password_enable: number = 1;
            if (!profile_pin || profile_pin === null) {
                is_password_enable = 0
            }
            const hashPasswwoed = md5(password);
            const qrData: any = await generateQr(username);

            const getCardDetail = `SELECT * FROM card_activation WHERE card_key = '${code}' LIMIT 1`;
            const [cardData]: any = await pool.query(getCardDetail);
            if (cardData.length === 0) {
                parsedData[parseDataIndex].failedMessage = `Code is invalid, Contact support!`;
                duplicateData.push(parsedData[parseDataIndex]);
                continue;
            }
            const cardNumber = cardData[0].card_number;
            const packageId = cardData[0].package_type; //account_type
            const primaryProfileLink = (config.vcardLink) + (username);

            const emailSql = `SELECT * FROM users WHERE deleted_at IS NULL AND (email = ? OR username = ? OR phone = ? OR card_number = ? OR card_number_fix = ?) LIMIT 1`;
            const emailVALUES = [email, username, phone, cardNumber, cardNumber];
            const [dupliRows]: any = await pool.query(emailSql, emailVALUES);
            if (dupliRows.length > 0) {
                let dupliKey: any;
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
            const VALUES = [userId, name, name, email, email, hashPasswwoed, username, cardNumber, dial_code, company_name, designation, website, address, qrData, phone, dial_code, phone, country, 100, 1, 0, 1, 1, 1, 0, 1, justDate, justDate, justDate, justDate, endDate, packageId, is_password_enable, profile_pin, 'vcard'];
            const [rows]: any = await pool.query(sql, VALUES);
            if (rows.affectedRows > 0) {
                const getFeatures = `SELECT * FROM features WHERE status = 1`
                const [featureData]: any = await pool.query(getFeatures);

                let addFeatures: any = `INSERT INTO users_features (feature_id, user_id, status) VALUES`;
                let featureStatus: any;
                let featureResult: any;

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
                    } else {
                        featureStatus = 0;
                    }

                    addFeatures = addFeatures + `(${element.id},${rows.insertId},${featureStatus}), `;
                    featureResult = addFeatures.substring(0, addFeatures.lastIndexOf(','));
                }

                const [userFeatureData]: any = await pool.query(featureResult)

                const updateCodeStatus = `UPDATE card_activation SET card_assign = '${config.ASSIGNEDStatus}' WHERE card_key = '${code}'`;
                const [cardRows]: any = await pool.query(updateCodeStatus);
            } else {
                parsedData[parseDataIndex].failedMessage = `Failed to insert`;
                duplicateData.push(parsedData[parseDataIndex]);
                continue;
            }

            let socialIndex = -1;
            const columnsArrays = Object.keys(parsedData[parseDataIndex]);
            console.log("columnsArray", columnsArrays);

            for await (const socialEle of socialRows) {
                socialIndex++;
                // const insertQuery = `INSERT INTO vcard_social_sites (user_id, site_id, label, value, created_at) VALUES(?, ?, ?, ?, ?, ?)`
                for await (const columEle of columnsArrays) {
                    if (socialEle.name == columEle) {
                        let socialValue = ele[columEle];
                        console.log("socialValue", socialValue);

                        insertSOcialQuery = insertSOcialQuery + `(${rows.insertId}, ${socialRows[socialIndex].id}, '${socialEle.name}', '${socialValue}', '${createdAt}'), `;
                        socialResult = insertSOcialQuery.substring(0, insertSOcialQuery.lastIndexOf(','));
                    }
                }
            }
        }
        console.log("socialResult", socialResult);
        if (socialResult != undefined && socialResult != null) {
            const [insertSocialData]: any = await pool.query(socialResult);
            // console.log("insertSocialData", insertSocialData);
        }

        console.log("duplicateData", duplicateData);
        if (duplicateData.length > 0) {
            const workbook = new Excel.Workbook();
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

            for await (const iterator of duplicateData) {
                const failedData = [iterator.username, iterator.name, iterator.email, iterator.dial_code, iterator.phone, iterator.country, iterator.code, iterator.failedMessage];
                worksheet.addRow(failedData);
            }
            const exportPath: any = path.resolve(__dirname, `failedUsers.xlsx`);

            await workbook.xlsx.writeFile(exportPath);
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

            var excelBucket: any = new AWS.S3({
                credentials,
                params: {
                    Bucket: bucketName
                }
            })

            excelBucket.upload({
                // ACL: 'public-read', 
                Body: fs.createReadStream(exportPath),
                Key: `${duplicateData.length}failedUsers${createdAt}.xlsx`, // file upload by below name
                // ContentType: 'application/octet-stream' // force download if it's accessed as a top location
            }, async (err: any, response: any) => {
                if (err) {
                    console.log(err);
                    return apiResponse.errorMessage(res, 400, "Failed!, Please Try again");
                }
                if (response) {
                    fs.unlink(exportPath, (err) => {
                        if (err) throw err //handle your error the way you want to;
                        console.log('file was deleted');//or else the file will be deleted
                    });
                    fs.unlink(file.path, (err) => {
                        if (err) throw err //handle your error the way you want to;
                        console.log('file was deleted');//or else the file will be deleted
                    });

                }
                console.log(response.Location);
                return apiResponse.successResponse(res, "Data Insert successfully, but some user are not inserted that is here", response.Location);
            });

        } else {
            return apiResponse.successResponse(res, "Users inserted successfully", '');
        }

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const importSampleFile = async (req: Request, res: Response) => {
    try {
        const excelUrl = 'https://imagefurb.s3.ap-south-1.amazonaws.com/staticFiles/vkImportSampleFile.xlsx';

        return apiResponse.successResponse(res, "Data Retrieved Successfully", excelUrl);
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ===================================================================================================


//not used
export const exportUserOld = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const sql1 = `INSERT INTO tableName (Circle Name, Region Name, Division Name, Office Name, Pincode, OfficeType, Delivery, District, StateName) VALUES ('Andhra Pradesh Circle', 'Kurnool Region', 'Anantapur Division', 'A Narayanapuram B.O', '515004', 'BO', 'Delivery', 'ANANTHAPUR', 'Andhra Pradesh');
`
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
        const [rows]: any = await pool.query(sql);

        const workbook = new Excel.Workbook();
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

        rows.forEach((element: any) => {
            const data = [element.user_id, element.username, element.name, element.email, element.phone, element.designation, element.website, element.company_name];
            worksheet.addRow(data);
            console.log("data", data);

        });

        const exportPath: any = path.resolve(__dirname, `users${userId}.xlsx`);
        console.log(exportPath);

        await workbook.xlsx.writeFile(exportPath);

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

        const newExportPath: any = fs.createReadStream('./Screenshot 2023-03-02 212441.png');
        console.log('newExportPath', newExportPath);

        let result;
        const fileStream = fs.createReadStream(newExportPath);
        console.log("fileStream", fileStream);

        let form = new FormData();
        form.append('file', newExportPath);
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
        };
        console.log("form", form);

        await axios.post('https://vkardz.com/api/uploadFile.php', form, {
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

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================




// ====================================================================================================
// ====================================================================================================
