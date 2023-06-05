"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactSyncSG = exports.favUserScan = exports.contactSync = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const lodash_1 = __importDefault(require("lodash"));
const contactSync = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let contacts = req.body.contacts;
        if (contacts.length > 100) {
            return apiResponse.errorMessage(res, 400, "Max Length is 100");
        }
        console.log("contacts", contacts);
        contacts = lodash_1.default.uniqBy(contacts, 'phone');
        console.log("uniq cotacts", contacts);
        let arr = [];
        for (const ele of contacts) {
            let phones = ele.phone;
            arr.push(phones);
        }
        console.log(arr);
        const checkSql = `SELECT phone FROM sync_contacts WHERE phone IN(${arr})`;
        const [rows] = yield db_1.default.query(checkSql);
        let finalArr = [];
        if (rows.length > 0) {
            const res = contacts.filter((x) => !rows.some((y) => y.phone === x.phone));
            // finalArr.push(res)
            finalArr = res;
            console.log("res", res);
        }
        else {
            finalArr = contacts;
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
            let insertQuery = `INSERT INTO sync_contacts(name, dial_code, phone, email) VALUES`;
            let result;
            for (const contactData of finalArr) {
                const name = contactData.name || '';
                const email = contactData.email || '';
                const dialCode = contactData.dialCode || '';
                const phone = contactData.phone;
                insertQuery = insertQuery + ` ('${name}', '${dialCode}', '${phone}', '${email}'), `;
                result = insertQuery.substring(0, insertQuery.lastIndexOf(','));
            }
            const [data] = yield db_1.default.query(result);
            console.log("finalArr", finalArr);
            if (data.affectedRows > 0) {
                return apiResponse.successResponse(res, "Contact Insert Successfully", null);
            }
            else {
                return apiResponse.errorMessage(res, 400, "Failed!");
            }
        }
        else {
            return apiResponse.successResponse(res, "Record Already Exist!", null);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something Went Wrong");
    }
});
exports.contactSync = contactSync;
// ====================================================================================================
// ====================================================================================================
//notused
const favUserScan = (users, uid, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = `SELECT fav_uid FROM favourite where uid = '${uid}' `;
    let [data] = yield db_1.default.query(sql);
    if (data.length === 0) {
        users.forEach((element, index) => {
            users[index].isFavourite = false;
        });
    }
    else {
        users.forEach((ele, i) => {
            for (let j = 0; j < data.rowCount; j++) {
                if (users[i].uid == data.rows[j].fav_uid) {
                    users[i].isFavourite = true;
                    break;
                }
                else {
                    users[i].isFavourite = false;
                }
            }
            delete users[i].uid;
        });
    }
    return users;
});
exports.favUserScan = favUserScan;
//not used
const contactSyncSG = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        let contactArray = req.body.contacts;
        let linkedContact = [];
        let unlinkedContact = [];
        let singleResultObject = {};
        // const userId = res.locals.jwt.userId;
        const createdAt = utility.dateWithFormat();
        if (contactArray.length > 100)
            return apiResponse.errorMessage(res, 400, "Please limit contact for 100 at a time !");
        console.log("contactArray", contactArray);
        const stringValue = contactArray.map((value) => `'${value.phone.replace(/\s+/g, '').trim()}'`).join(',');
        console.log("stringValue", stringValue);
        // const stringValue = contactArray.map((value:any) => `'${value}'`).join(',');
        if (contactArray.length < 1)
            return apiResponse.errorMessage(res, 400, "Please pass the contact pay ");
        const contactSql = `SELECT phone, id FROM users where phone IN(${stringValue}) and deleted_at is null LIMIT 100`;
        const [contactData] = yield db_1.default.query(contactSql);
        // const dbData: any = contactData.rows;
        console.log("contactSql", contactSql);
        console.log("contactData", contactData);
        if (contactData.length > 0) {
            console.log("loopcontactArray", contactArray);
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
                    }
                    else {
                        unlinkedContact.push(ele[reqIndex]);
                    }
                }
            }
        }
        else {
            console.log("contactArray", contactArray);
            unlinkedContact = contactArray;
        }
        console.log("unlinkedContact", unlinkedContact);
        console.log("linkedContact", linkedContact);
        let insertSql = `INSERT INTO sync_contacts(name, dial_code, phone, email, created_at) VALUES `;
        let result;
        try {
            for (var _d = true, unlinkedContact_1 = __asyncValues(unlinkedContact), unlinkedContact_1_1; unlinkedContact_1_1 = yield unlinkedContact_1.next(), _a = unlinkedContact_1_1.done, !_a;) {
                _c = unlinkedContact_1_1.value;
                _d = false;
                try {
                    const element = _c;
                    const name = element.name || '';
                    const dialCode = element.dialCode || '';
                    const phone = element.phone;
                    const email = element.email || '';
                    insertSql = insertSql + `('${name}', '${dialCode}', '${phone}', '${email}', '${createdAt}')`;
                    result = insertSql.substring(0, insertSql.lastIndexOf(','));
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = unlinkedContact_1.return)) yield _b.call(unlinkedContact_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        console.log("insertSql", insertSql);
        console.log("result", result);
        return;
        const [rows] = yield db_1.default.query(result);
        console.log("rows", rows);
        if (rows.affectedRows > 0) {
            return apiResponse.successResponse(res, "Contacts syncs successfully", null);
        }
        else {
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
            if (found === 0) {
                unlinkedContact.push(contactArray[i]);
            }
        }
        const data = yield (0, exports.favUserScan)(linkedContact, 'userId', res);
        data.forEach((element, index) => {
            delete data[index].uid;
        });
        // singleResultObject.linkdLength = data.length;
        // singleResultObject.unlinkdLength = unlinkedContact.length;
        singleResultObject.linkedContact = data;
        singleResultObject.unlinkedContact = unlinkedContact;
        apiResponse.successResponse(res, singleResultObject, "Contact list here");
    }
    catch (e) {
        console.log(e);
        yield apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.contactSyncSG = contactSyncSG;
// ====================================================================================================
// ====================================================================================================
