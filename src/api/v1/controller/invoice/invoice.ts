import { Request, Response } from "express";
import puppeteer from 'puppeteer';
import Handlebars from "handlebars";
import fs from "fs";
import path from 'path';
import pool from '../../../../db';
import * as apiResponse from '../../helper/apiResponse';
import * as utility from "../../helper/utility";
import config  from '../../config/development';


export const invoice =async (req:Request, res:Response) => {
    try {
        const userId:string = res.locals.jwt.userId;
        const paymentId = req.query.paymentId;
        let tr = ``;
        let data:any;

        const sql = `SELECT id, name, txn_id, created_at, address, city, country, pincode, phone_number, payment_type, delivery_charges, price FROM all_payment_info WHERE user_id = ${userId} AND id = ${paymentId}`;
        const [paymntDetails]:any = await pool.query(sql);

        let paymentMethod:any
        if (paymntDetails[0].payment_type === 1) {
            paymentMethod = 'cod';
        } else {
            paymentMethod = 'online';
        }

        const name = paymntDetails[0].name;
        const orderId = paymntDetails[0].txn_id;
        const date = paymntDetails[0].date;
        const address = paymntDetails[0].address;
        const city = paymntDetails[0].city;
        const country = paymntDetails[0].country;
        const pincode = paymntDetails[0].pincode;
        const phone = paymntDetails[0].phone_number;
        const deliveryCharges = paymntDetails[0].delivery_charges;
        const price = paymentMethod[0].price;

        const getOrderListQuery = `SELECT products.name, orderlist.qty, orderlist.sub_total, orderlist.created_at FROM orderlist LEFT JOIN products ON products.product_id = orderlist.product_id WHERE orderlist.order_id = ${paymntDetails[0].id}`;
        const [orderData]:any = await pool.query(getOrderListQuery);

        
        let totalAmount:any;

        orderData.forEach((element:any, index:any) => {
            totalAmount = totalAmount + element.sub_total; 
            tr = tr + `<tr>
            <td style="font-size: 16px; font-family: 'Hanken Grotesk', sans-serif; color: #FF6D01;  line-height: 18px;  vertical-align: top; padding:10px 0;" class="article">
              ${element.name}
            </td>
            <td style="font-size: 16px; font-family: 'Hanken Grotesk', sans-serif; color: #646a6e;  line-height: 18px;  vertical-align: top; padding:10px 0;">${''}</td>
            <td style="font-size: 16px; font-family: 'Hanken Grotesk', sans-serif; color: #646a6e;  line-height: 18px;  vertical-align: top; padding:10px 0;" align="center">${element.qty}</td>
            <td class="price" style="font-size: 16px; font-family: 'Hanken Grotesk', sans-serif; color: #1e2b33;  line-height: 18px;  vertical-align: top; padding:10px 0;" align="right">${element.sub_total}</td>
          </tr>
          <tr>
            <td height="1" colspan="4" style="border-bottom:1px solid #e4e4e4"></td>
          </tr>`
        })

        var grandTotals:string = `${totalAmount} + ${deliveryCharges}`;
        data = {
            name: paymntDetails[0].name,
            orderId: paymntDetails[0].txn_id,
            date: paymntDetails[0].date,
            address: paymntDetails[0].address,
            city: paymntDetails[0].city,
            country: paymntDetails[0].country,
            pincode: paymntDetails[0].pincode,
            phone: paymntDetails[0].phone_number,
            paymentDate: paymntDetails[0].date,
            paymentMethod: paymentMethod,
            deliveryCharges: paymntDetails[0].delivery_charges,
            GST: '00.0',
            discount: '00.0',
            grandTotal: '',
            totalAmount: totalAmount,
            // grandTotal: grandTotals
        }

        const templateHtml = fs.readFileSync(path.join('./views', 'invoice.hbs'), 'utf8');
        var template = Handlebars.compile(templateHtml);
        var html = template(tr);   
        const browser = await puppeteer.launch({
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        env: {  
            DISPLAY: ":10.0"
        }
      })
      const page = await browser.newPage();        // Create a new page
      await page.setContent(html, { waitUntil: 'domcontentloaded' }); 
      await page.emulateMediaType('screen'); // To reflect CSS used for screens instead of print

      // Downlaod the PDF
      const pdf = await page.pdf({
        path: './'+'\\'+"nu"+".pdf",
        margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
        printBackground: true,
        format: 'A4',
    });

    console.log("path", './'+'\\'+"nu"+".pdf");
    // console.log("pdf path", pdf.path);
    
    // Close the browser instance
    await browser.close();

    return apiResponse.successResponse(res, "Data Retrieved Successfully", "path");

    } catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
}
// ====================================================================================================
// ====================================================================================================
