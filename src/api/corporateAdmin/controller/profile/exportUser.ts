import { Request, Response } from "express";
import pool from "../../../../db";
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config from "../../config/development";
import Excel from 'exceljs';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import xlsx from 'xlsx';

export const exportUser = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.jwt.userId;

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
        
        let result;
        const fileStream = fs.createReadStream(path.resolve(__dirname, `Screenshot 2023-03-02 212441.png`));
        let form = new FormData();
        form.append('file', fileStream);
        const config = {
            headers: {
              'content-type': 'multipart/form-data',
            },
          };
          await axios.post('https://vkardz.com/api/uploadFile.php', form, config)
          .then((response) => {
            result = response.data
            console.log(response.data);
          })
          .catch((error) => {
            result = error
            console.log(error);
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

        return apiResponse.successResponse(res, "Exported Successfully", result);

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================

export const importUser =async (req:Request, res:Response) => {
    try {
        const userId = res.locals.jwt.userId;
        const justDate = utility.dateWithFormat();
        const endDate = utility.extendedDateWithFormat("yearly");
        const file:any = req.file

        const fileData = xlsx.readFile(file.path); // Read the file using pathname        
        const sheetNames: any = fileData.SheetNames; // Grab the sheet info from the file
        const totalSheets: any = (sheetNames.length);

        let parsedData:any = []; // Variable to store our data 
        for (let i = 0; i < totalSheets; i++) { // Loop through sheets
            const tempData = xlsx.utils.sheet_to_json(fileData.Sheets[sheetNames[i]]);  // Convert to json using xlsx
            // tempData.shift(); // Skip header row which is the colum names or if want header use this..
            parsedData.push(...tempData); // Add the sheet's json to our data array
        }
        if (parsedData.length === 0) {
            return apiResponse.errorMessage(res, 400, "Empty rows!!")
        }
        const maxRecord:number = 50;
        if (parsedData.length >= maxRecord) {
            return apiResponse.errorMessage(res, 400, `You can't insert more than ${maxRecord} records!`);
        }

        let insertQuery =  `INSERT INTO users(username, name, card_number, card_number_fix, email, dial_code, phone, country, password, login_time, account_type, start_date, end_date, post_time, created_at) VALUES `;
        let result;

        let dataIndex = -1;
        let element:any;
        let duplicateData:any;
        for (element of parsedData) {
            dataIndex++;

            const emailSql = `SELECT * FROM users WHERE deleted_at IS NULL AND (email = ? or username = ? or phone = ?) LIMIT 1`;
            const emailVALUES = [element.email, element.username, element.phone];
            const [dupliRows]:any = await pool.query(emailSql, emailVALUES);
            if (dupliRows.length > 0) {
                if (dupliRows[0].email === element.email) {
                    // dupli.push("email");
                }
                if (dupliRows[0].username === element.username) {
                    // dupli.push("username");
                }
                if (dupliRows[0].phone === element.phone) {
                    // dupli.push("phone");
                }
                parsedData[dataIndex].failedMessage = 
                duplicateData.push(parsedData[dataIndex])
            }
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}

// ====================================================================================================
// ====================================================================================================
