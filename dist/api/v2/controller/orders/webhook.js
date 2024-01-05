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
exports.webhookApi = void 0;
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const crypto_1 = __importDefault(require("crypto"));
const webhookSecret = process.env.WEBHOOK_SECRET;
const webhookApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const secret = webhookSecret;
        // const referenceId = req.body.payload.payment.entity.notes.reference_id;
        // const paymentStatus = req.body.payload.payment.entity.status;
        // let status: any;
        // if (paymentStatus == 'failed') {
        //   status = 'failed'
        // } else {
        //   status = 'Received'
        // }
        yield utility.sendMail('vishalpathriya9252@gmail.com', `test webhook${"referenceId"}`, JSON.stringify(req.body));
        console.log(JSON.stringify(req.body));
        const data = crypto_1.default.createHmac('sha256', secret);
        data.update(JSON.stringify(req.body));
        const digest = data.digest('hex');
        // // const generated_signature = instance.webhook.verify(req.body);
        // await utility.sendMail('vishalpathriya29@gmail.com', "test webhook", req.body)
        if (digest === req.headers['x-razorpay-signature']) {
            console.log('request is legit', digest);
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
            });
            // } else {
            //   res.json({
            //     status: 'failed'
            //   })
            // }
        }
        else {
            console.log('Invalid signature', "generated_signature:", digest, "req.headers:", req.headers['x-razorpay-signature']);
            res.status(400).send('Invalid signature');
        }
        // return res.json({
        //     status: false,
        //     data: null,
        //     message: "Success"
        //   })
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.webhookApi = webhookApi;
// ====================================================================================================
// ====================================================================================================
