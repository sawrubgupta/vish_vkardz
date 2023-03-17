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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactSync = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const contactSync = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contacts = req.body.contacts;
        if (contacts.length > 100) {
            return apiResponse.errorMessage(res, 400, "Max Length is 100");
        }
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
            let insertQuery = `INSERT INTO sync_contacts(name, phone, email) VALUES`;
            let result;
            for (const contactData of finalArr) {
                const name = contactData.name;
                const email = contactData.email;
                const phone = contactData.phone;
                insertQuery = insertQuery + ` ('${name}', '${phone}', '${email}'), `;
                result = insertQuery.substring(0, insertQuery.lastIndexOf(','));
            }
            const [data] = yield db_1.default.query(result);
            console.log("finalArr", finalArr);
            if (data.affectedRows > 0) {
                return yield apiResponse.successResponse(res, "Contact Insert Successfully", null);
            }
            else {
                return yield apiResponse.errorMessage(res, 400, "Failed!");
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
