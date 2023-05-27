import { Request, Response } from "express";
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";

export const favUserScan =async (users:any, uid:any, res:Response) => {


    const sql = `SELECT fav_uid FROM favourite where uid = '${uid}' `;
    let [data]:any = await pool.query(sql);


    if(data.length === 0){
        users.forEach((element:any, index:number) => {
            users[index].isFavourite = false;
        });
    }else{
          users.forEach((ele:any, i:number) => {

              for(let j =0; j < data.rowCount; j++){

                  if(users[i].uid == data.rows[j].fav_uid){
                      users[i].isFavourite = true;
                      break;
                  }else{
                      users[i].isFavourite = false;
                  }
              }

              delete users[i].uid;
      
            });
        
    }

    return users;

}


export const contactSync = async (req: Request, res: Response) => {
    try {

        let contactArray = req.body;
        let linkedContact: any[] = [];
        let unlinkedContact: any[] = [];
        let singleResultObject: any = {};
        const userId = res.locals.jwt.userId;

        if (contactArray.length > 100) return apiResponse.errorMessage(res, 400, "Please limit contact for 100 at a time !");

        const stringValue = contactArray.map((value: any) =>
            `'${value.number.replace(/\s+/g, '').trim()}'`).join(',')


        // const stringValue = contactArray.map((value:any) => `'${value}'`).join(',');

        if (contactArray.length < 1) return apiResponse.errorMessage(res, 400, "Please pass the contact pay ");
        const contactSql = `SELECT phone_number, email, username, image, full_name, uid FROM users where phone_number IN(${stringValue}) and uid != '${userId}' and deleted_at is null LIMIT  100`
        const [contactData]:any = await pool.query(contactSql);
        const dbData: any = contactData.rows;

        if (contactData.length < 1) {
            // singleResultObject.linkdLength = dbData.length;
            // singleResultObject.unlinkdLength = contactArray.length;
            singleResultObject.linkedContact = [];
            singleResultObject.unlinkedContact = contactArray;
            return apiResponse.successResponse(res, singleResultObject, "No data found");
        }


        let i = -1;
        for (const element of contactArray) {
            i++;

            let j = -1;
            let found = 0;
            for (const dbDataIndex of dbData) {
                j++;

                if ((contactArray[i].number).replace(/\s+/g, '').trim() === dbDataIndex.phone_number) {
                    contactArray[i].email = dbDataIndex.email;
                    contactArray[i].username = dbDataIndex.username;
                    contactArray[i].image = dbDataIndex.image;
                    contactArray[i].full_name = dbDataIndex.full_name;
                    contactArray[i].phone_number = dbDataIndex.phone_number;
                    contactArray[i].uid = dbDataIndex.uid;
                    linkedContact.push(contactArray[i]);
                    found++;
                    break;
                    
                } 
            }

            if(found === 0){
                unlinkedContact.push(contactArray[i]);
            }

            
        }

        const data = await favUserScan(linkedContact, userId, res);

        data.forEach((element: any, index: number) => {
            delete data[index].uid;
        });


        // singleResultObject.linkdLength = data.length;
        // singleResultObject.unlinkdLength = unlinkedContact.length;
        singleResultObject.linkedContact = data;
        singleResultObject.unlinkedContact = unlinkedContact;
        

        apiResponse.successResponse(res, singleResultObject, "Contact list here");

    } catch (e) {
        console.log(e);
        await apiResponse.errorMessage(res, 400, "Something went wrong");
    }

}

// ====================================================================================================
// ====================================================================================================


export const contactSyncold =async (req:Request, res:Response) => {
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
                return apiResponse.successResponse(res, "Contact Insert Successfully", null);
            } else {
                return apiResponse.errorMessage(res, 400, "Failed!");
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
