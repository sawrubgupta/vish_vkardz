import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";


export const contactSync =async (req:Request, res:Response) => {
    try {
        const contacts:any = req.body.contacts;
        if (contacts.length > 100) {
            return apiResponse.errorMessage(res, 400, "Max Length is 100");
        }
        
        let arr:any = [];
        for (const ele of contacts) {
            let phones = ele.phone;
            arr.push(phones);
        }
        console.log(arr);

        const checkSql = `SELECT phone FROM sync_contacts WHERE phone IN(${arr})`;
        const [rows]:any = await pool.query(checkSql);

        let finalArr:any = [];
        if (rows.length > 0) {
            const res = contacts.filter((x:any) => !rows.some((y:any) => y.phone === x.phone));
            // finalArr.push(res)
            finalArr = res;
            console.log("res", res);
            
        } else {
            finalArr = contacts
        }

        // if (rows.length > 0) {
        //     let arrIndex = -1
        //     for (const element of contacts) {
        //         arrIndex++;
        //         console.log("element", element);
                
        //         let rowIndex = -1;
        //         for (const ele of rows) {
        //             rowIndex++;
        //             console.log("ele",ele);
        //             console.log("element[arrIndex].phone", element.phone);
                    
        //             if (element.phone === ele.phone) {
        //                 console.log("if return");
                        
        //                 break;
        //             }
        //                 console.log("push in array");
                        
        //                 const data = {
        //                     name: element.name,
        //                     email: element.email,
        //                     phone: element.phone
        //                 }
        //                 console.log("data", data);
                        
        //                 finalArr.push(data)
                    
        //         }
        //     }    
        // } else {
        //     finalArr = contacts
        // }

        if (finalArr.length > 0) {  
            let insertQuery:any = `INSERT INTO sync_contacts(name, phone, email) VALUES`
            let result:any;
            for (const contactData of finalArr) {
                const name = contactData.name;
                const email = contactData.email;
                const phone = contactData.phone;
    
                insertQuery = insertQuery + ` ('${name}', '${phone}', '${email}'), `;
                result = insertQuery.substring(0,insertQuery.lastIndexOf(','));
            }
            const [data]:any = await pool.query(result)
            console.log("finalArr",finalArr);
            
            if (data.affectedRows > 0) {
                return await apiResponse.successResponse(res, "Contact Insert Successfully", null);
            } else {
                return await apiResponse.errorMessage(res, 400, "Failed!");
            }    
        } else {
            return apiResponse.successResponse(res, "Record Already Exist!", null);
        }
    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
}
// ====================================================================================================
// ====================================================================================================
