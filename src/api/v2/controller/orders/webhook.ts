import { Request, Response, NextFunction } from "express";
import pool from "../../../../dbV2";
import * as apiResponse from '../../helper/apiResponse';
import config from '../../config/development';
import * as utility from "../../helper/utility";
import crypto from 'crypto';

const webhookSecret = process.env.WEBHOOK_SECRET;

export const webhookApi = async (req: Request, res: Response) => {
  try {
    const secret: any = webhookSecret;
    // const referenceId = req.body.payload.payment.entity.notes.reference_id;
    // const paymentStatus = req.body.payload.payment.entity.status;
    // let status: any;
    // if (paymentStatus == 'failed') {
    //   status = 'failed'
    // } else {
    //   status = 'Received'
    // }

    await utility.sendMail('vishalpathriya9252@gmail.com', `test webhook${"referenceId"}`, JSON.stringify(req.body))
    console.log(JSON.stringify(req.body));   

    const data = crypto.createHmac('sha256', secret)
    data.update(JSON.stringify(req.body))


    const digest = data.digest('hex')

    // // const generated_signature = instance.webhook.verify(req.body);
    // await utility.sendMail('vishalpathriya29@gmail.com', "test webhook", req.body)

    if (digest === req.headers['x-razorpay-signature']) {
      console.log('request is legit', digest)

      // const referenceId = req.body.payload.payment.entity.notes.reference_id;

      //we can store detail in db and send the response
      // const sql = `UPDATE payment_details SET status = ? WHERE id = ?`;
      // const VALUES = [status, referenceId]
      // const [rows]: any = await pool.query(sql, VALUES);

      // const getNum = `SELECT client.name, client.phone, payment_details.amount FROM payment_details LEFT JOIN client ON payment_details.client_id = client.id WHERE payment_details.id = ${referenceId} LIMIT 1`;
      // const [data]: any = await pool.query(getNum);

      // const msg = `Hello ${data[0].name},%nGreetings from Cannis Lupus Services India Private Limited. We have received your payment of ₹ 10.%nFor any query, please call: +91-9582112979 or email info@furballstory.com`;
      //   const result = await utility.sendSms(data[0].phone, msg);
      // const msg = `Hello ${data[0].name},%0aGreetings from Cannis Lupus Services India Private Limited. We have received your payment of ₹ ${data[0].amount}.%0aFor any query, please call: %252B91-9582112979 or email info@furballstory.com`
      // const result = await utility.sendSmsApi(data[0].phone, "CISLUP", msg)

      //   if(result  === false){ 
      //       console.log(`Failed to send otp with your number ${data[0].phone}`);
      //       return apiResponse.errorMessage(res, 400, "Failed to send payment link, Please try again later");
      //   }

      // if (rows.affectedRows) {
        res.json({
          status: 'ok'
        })
      // } else {
      //   res.json({
      //     status: 'failed'
      //   })
      // }
    } else {
      console.log('Invalid signature', "generated_signature:", digest, "req.headers:", req.headers['x-razorpay-signature']);
      res.status(400).send('Invalid signature');
    }


    // return res.json({
    //     status: false,
    //     data: null,
    //     message: "Success"
    //   })

  } catch (error) {
    console.log(error);
    return apiResponse.errorMessage(res, 400, "Something went wrong");
  }
}

// ====================================================================================================
// ====================================================================================================
