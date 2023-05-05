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
