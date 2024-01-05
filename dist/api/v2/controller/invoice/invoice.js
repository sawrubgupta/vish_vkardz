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
exports.invoice = void 0;
const apiResponse = __importStar(require("../../helper/apiResponse"));
const development_1 = __importDefault(require("../../config/development"));
let bucketName = process.env.BUCKET_NAME;
const credentials = development_1.default.AWS;
const invoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId: string = res.locals.jwt.userId;
        // const paymentId = req.query.paymentId;
        // let tr = ``;
        // let data: any;
        // const sql = `SELECT id, name, txn_id, created_at, address, city, country, pincode, phone_number, payment_type, delivery_charges, price, gst_amount, coupon_discount FROM all_payment_info WHERE user_id = ${userId} AND id =  ${paymentId} LIMIT 1`;
        // const [paymntDetails]: any = await pool.query(sql);
        // let deliveryCharges: number = Number(paymntDetails[0].delivery_charges);
        // let paymentMethod: any
        // if (paymntDetails[0].payment_type === 1) {
        //   paymentMethod = 'cod';
        // } else {
        //   paymentMethod = 'online';
        // }
        // const getOrderListQuery = `SELECT products.name, orderlist.qty, orderlist.sub_total, orderlist.created_at FROM orderlist LEFT JOIN products ON products.product_id = orderlist.product_id WHERE orderlist.order_id = ${paymntDetails[0].id}`;
        // const [orderData]: any = await pool.query(getOrderListQuery);
        // let totalAmount: number = 0;
        // orderData.forEach((element: any, index: any) => {
        //   totalAmount = totalAmount + element.sub_total;
        //   tr = tr + `<tr>
        //         <td style="font-size: 16px; font-family: 'Hanken Grotesk', sans-serif; color: #FF6D01;  line-height: 18px;  vertical-align: top; padding:10px 0;" class="article">
        //           ${element.name}
        //         </td>
        //         <td style="font-size: 16px; font-family: 'Hanken Grotesk', sans-serif; color: #646a6e;  line-height: 18px;  vertical-align: top; padding:10px 0;">${''}</td>
        //         <td style="font-size: 16px; font-family: 'Hanken Grotesk', sans-serif; color: #646a6e;  line-height: 18px;  vertical-align: top; padding:10px 0;" align="center">${element.qty}</td>
        //         <td class="price" style="font-size: 16px; font-family: 'Hanken Grotesk', sans-serif; color: #1e2b33;  line-height: 18px;  vertical-align: top; padding:10px 0;" align="right">${element.sub_total}</td>
        //       </tr>
        //       <tr>
        //         <td height="1" colspan="4" style="border-bottom:1px solid #e4e4e4"></td>
        //       </tr>`
        // })
        // let grandTotals: number = totalAmount + deliveryCharges;
        // data = {
        //   name: paymntDetails[0].name,
        //   orderId: paymntDetails[0].txn_id,
        //   date: paymntDetails[0].created_at,
        //   address: paymntDetails[0].address,
        //   city: paymntDetails[0].city,
        //   country: paymntDetails[0].country,
        //   pincode: paymntDetails[0].pincode,
        //   phone: paymntDetails[0].phone_number,
        //   paymentDate: paymntDetails[0].created_at,
        //   paymentMethod: paymentMethod,
        //   deliveryCharges: paymntDetails[0].delivery_charges,
        //   GST: paymntDetails[0].gst_amount,
        //   discount: paymntDetails[0].coupon_discount,
        //   totalAmount: totalAmount,
        //   grandTotal: grandTotals,
        //   tr: tr
        // }
        // const templateHtml = fs.readFileSync(path.join('./views', 'invoice.hbs'), 'utf8');
        // var template = Handlebars.compile(templateHtml);
        // var html = template(data);
        // const browser = await puppeteer.launch({
        //   headless: true,
        //   args: ['--no-sandbox', '--disable-setuid-sandbox'],
        //   ignoreDefaultArgs: ['--disable-extensions'],
        //   env: {
        //     DISPLAY: ":10.0"
        //   }
        // })
        // const page = await browser.newPage();        // Create a new page
        // await page.setContent(html);
        // await page.emulateMediaType('screen'); // To reflect CSS used for screens instead of print
        // await page.waitForSelector('img');
        // // Downlaod the PDF
        // const pdfPath = './public_html/invoice/' + '\\' + 'invoice' + paymentId + ".pdf";
        // const pdf = await page.pdf({
        //   path: pdfPath,
        //   margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
        //   printBackground: true,
        //   format: 'A4',
        // });
        // // Close the browser instance
        // await browser.close();
        // var pdfBucket: any = new AWS.S3({
        //   credentials,
        //   params: {
        //     Bucket: bucketName
        //   }
        // })
        // pdfBucket.upload({
        //   // ACL: 'public-read', 
        //   Body: fs.createReadStream(pdfPath),
        //   Key: 'invoices/' + 'invoice' + paymentId + ".pdf", // file upload by below name
        //   // ContentType: 'application/octet-stream' // force download if it's accessed as a top location
        // }, async (err: any, response: any) => {
        //   if (err) {
        //     console.log(err);
        //     return apiResponse.errorMessage(res, 400, "Failed to create invoice, Please Try again");
        //   }
        //   if (response) {
        //     fs.unlink(pdfPath, (err) => {
        //       if (err) throw err //handle your error the way you want to;
        //       console.log('file was deleted');//or else the file will be deleted
        //     });
        //   }
        //     return apiResponse.successResponse(res, "Data Retrieved Successfully", response.Location);
        // });
    }
    catch (error) {
        console.log(error);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.invoice = invoice;
// ====================================================================================================
// ====================================================================================================
