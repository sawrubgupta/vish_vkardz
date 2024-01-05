import { Request, Response } from "express";
import pool from '../../../../dbV2';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import _ from 'lodash';
import resMsg from '../../config/responseMsg';

const contactSyncResMsg = resMsg.dashboard.contactSync;


export const contactSync =async (req:Request, res:Response) => {
    try {
        let contacts:any = req.body.contacts;
        if (contacts.length > 100) return apiResponse.errorMessage(res, 400, contactSyncResMsg.contactSync.maxLengthMsg);
                
        contacts = _.uniqBy(contacts, 'phone');        
        let arr:any = [];
        for (const ele of contacts) {
            let phones = ele.phone;
            arr.push(phones);
        }

        const checkSql = `SELECT phone FROM sync_contacts WHERE phone IN(${arr})`;
        const [rows]:any = await pool.query(checkSql);

        let finalArr:any = [];
        if (rows.length > 0) {
            const res = contacts.filter((x:any) => !rows.some((y:any) => y.phone === x.phone));
            // finalArr.push(res)
            finalArr = res;
            
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
            let insertQuery:any = `INSERT INTO sync_contacts(name, dial_code, phone, email) VALUES`
            let result:any;
            for (const contactData of finalArr) {
                const name = contactData.name || '';
                const email = contactData.email || '';
                const dialCode = contactData.dialCode || '';
                const phone = contactData.phone;
    
                insertQuery = insertQuery + ` ('${name}', '${dialCode}', '${phone}', '${email}'), `;
                result = insertQuery.substring(0,insertQuery.lastIndexOf(','));
            }
            const [data]:any = await pool.query(result)
            
            if (data.affectedRows > 0) {
                return apiResponse.successResponse(res, contactSyncResMsg.contactSync.successMsg, null);
            } else {
                return apiResponse.errorMessage(res, 400, contactSyncResMsg.contactSync.failedMsg);
            }  
        }  
        // } else {
        //     return apiResponse.successResponse(res, "Record Already Exist!", null);
        // }
    } catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
}

// ====================================================================================================
// ====================================================================================================


//notused
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

//not used
export const contactSyncSG = async (req: Request, res: Response) => {
    try {

        let contactArray = req.body.contacts;
        let linkedContact: any[] = [];
        let unlinkedContact: any[] = [];
        let singleResultObject: any = {};
        // const userId = res.locals.jwt.userId;
        const createdAt = utility.dateWithFormat();

        if (contactArray.length > 100) return apiResponse.errorMessage(res, 400, "Please limit contact for 100 at a time !");
console.log("contactArray", contactArray);

        const stringValue = contactArray.map((value: any) =>
            `'${value.phone.replace(/\s+/g, '').trim()}'`).join(',')
console.log("stringValue", stringValue);


        // const stringValue = contactArray.map((value:any) => `'${value}'`).join(',');

        if (contactArray.length < 1) return apiResponse.errorMessage(res, 400, "Please pass the contact pay ");

        const contactSql = `SELECT phone, id FROM users where phone IN(${stringValue}) and deleted_at is null LIMIT 100`;
        const [contactData]:any = await pool.query(contactSql);
        // const dbData: any = contactData.rows;
console.log("contactSql", contactSql);
console.log("contactData", contactData);

        if (contactData.length > 0) {
            console.log("loopcontactArray",contactArray);

            let reqIndex = -1;
            let dbIndex = -1;
            for (const ele of contactData) {
                reqIndex++;
    console.log("ele", ele);
    
                for (const dbElement of contactArray) {
                    dbIndex++;
    console.log("dbElement", dbElement);
    
                    if (ele[reqIndex].phone == dbElement[dbIndex].phone) {
                        linkedContact.push(ele[reqIndex]);
                        continue;
                    } else {
                        unlinkedContact.push(ele[reqIndex]);
                    }
                }
            }
    
        } else {
            console.log("contactArray",contactArray);
            
            unlinkedContact = contactArray;
        }
console.log("unlinkedContact", unlinkedContact);
console.log("linkedContact", linkedContact);

        let insertSql:any = `INSERT INTO sync_contacts(name, dial_code, phone, email, created_at) VALUES `;
        let result:any;
        for await (const element of unlinkedContact) {
            const name = element.name || '';
            const dialCode = element.dialCode || '';
            const phone = element.phone;
            const email = element.email || '';

            insertSql = insertSql + `('${name}', '${dialCode}', '${phone}', '${email}', '${createdAt}')`;
            result = insertSql.substring(0, insertSql.lastIndexOf(','));
        }
        console.log("insertSql", insertSql);
        console.log("result", result);
        return;
        const [rows]:any = await pool.query(result);
console.log("rows", rows);

        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Contacts syncs successfully", null);
        } else {
            return apiResponse.errorMessage(res, 400, "Something went wrong");
        }
        // if (contactData.length < 1) {
            // singleResultObject.linkdLength = dbData.length;
            // singleResultObject.unlinkdLength = contactArray.length;
            // singleResultObject.linkedContact = [];
            // singleResultObject.unlinkedContact = contactArray;
            // return apiResponse.successResponse(res, singleResultObject, "No data found");
        // }


        let i = -1;
        for (const element of contactArray) {
            i++;

            let j = -1;
            let found = 0;
            for (const dbDataIndex of contactData) {
                j++;

                if ((contactArray[i].number).replace(/\s+/g, '').trim() === dbDataIndex.phone) {
                    contactArray[i].email = dbDataIndex.email;
                    contactArray[i].username = dbDataIndex.username;
                    contactArray[i].image = dbDataIndex.image;
                    contactArray[i].full_name = dbDataIndex.full_name;
                    contactArray[i].phone = dbDataIndex.phone;
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

        const data = await favUserScan(linkedContact, 'userId', res);

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

