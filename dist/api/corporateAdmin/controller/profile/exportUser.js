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
exports.importUser = exports.exportUser = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const exceljs_1 = __importDefault(require("exceljs"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const xlsx_1 = __importDefault(require("xlsx"));
const exportUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const [rows] = yield db_1.default.query(sql);
        const workbook = new exceljs_1.default.Workbook();
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
        rows.forEach((element) => {
            const data = [element.user_id, element.username, element.name, element.email, element.phone, element.designation, element.website, element.company_name];
            worksheet.addRow(data);
            console.log("data", data);
        });
        const exportPath = path_1.default.resolve(__dirname, `users${userId}.xlsx`);
        console.log(exportPath);
        yield workbook.xlsx.writeFile(exportPath);
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
        const fileStream = fs_1.default.createReadStream(path_1.default.resolve(__dirname, `Screenshot 2023-03-02 212441.png`));
        let form = new form_data_1.default();
        form.append('file', fileStream);
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
        };
        yield axios_1.default.post('https://vkardz.com/api/uploadFile.php', form, config)
            .then((response) => {
            result = response.data;
            console.log(response.data);
        })
            .catch((error) => {
            result = error;
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
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.exportUser = exportUser;
// ====================================================================================================
// ====================================================================================================
const importUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const justDate = utility.dateWithFormat();
        const endDate = utility.extendedDateWithFormat("yearly");
        const file = req.file;
        const fileData = xlsx_1.default.readFile(file.path); // Read the file using pathname        
        const sheetNames = fileData.SheetNames; // Grab the sheet info from the file
        const totalSheets = (sheetNames.length);
        let parsedData = []; // Variable to store our data 
        for (let i = 0; i < totalSheets; i++) { // Loop through sheets
            const tempData = xlsx_1.default.utils.sheet_to_json(fileData.Sheets[sheetNames[i]]); // Convert to json using xlsx
            // tempData.shift(); // Skip header row which is the colum names or if want header use this..
            parsedData.push(...tempData); // Add the sheet's json to our data array
        }
        if (parsedData.length === 0) {
            return apiResponse.errorMessage(res, 400, "Empty rows!!");
        }
        const maxRecord = 50;
        if (parsedData.length >= maxRecord) {
            return apiResponse.errorMessage(res, 400, `You can't insert more than ${maxRecord} records!`);
        }
        let insertQuery = `INSERT INTO users(username, name, card_number, card_number_fix, email, dial_code, phone, country, password, login_time, account_type, start_date, end_date, post_time, created_at) VALUES `;
        let result;
        let dataIndex = -1;
        let element;
        let duplicateData;
        for (element of parsedData) {
            dataIndex++;
            const emailSql = `SELECT * FROM users WHERE deleted_at IS NULL AND (email = ? or username = ? or phone = ?) LIMIT 1`;
            const emailVALUES = [element.email, element.username, element.phone];
            const [dupliRows] = yield db_1.default.query(emailSql, emailVALUES);
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
                    duplicateData.push(parsedData[dataIndex]);
            }
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.importUser = importUser;
// ====================================================================================================
// ====================================================================================================
