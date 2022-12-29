"use strict";
// import admin from "firebase-admin";
// import {Request, Response, NextFunction} from "express";
// import * as apiResponse from '../helper/apiResponse';
// import  ServiceAccount  from "../../../";
// // admin.initializeApp({
// //     credential: admin.credential.cert("")
// //   });
// export async function fcmSend(notification: any, registrationTokens: any, extraData:any) {
//     if(!extraData){
//         extraData = null 
//     }   
//     let returnData = null;
//     try {
//         registrationTokens = (registrationTokens);
//         if(registrationTokens.length === 0) {
//             console.log("Empty token");
//             return
//         } 
//         let message = {
//             notification: notification,
//             "android": {
//                 "notification": {
//                     "sound": "default"
//                 }
//             },
//             "apns": {
//                 "payload": {
//                     "aps": {
//                         "sound": "default"
//                     }
//                 }
//             },
//             tokens: registrationTokens,
//             data: notification,
//             "webpush": {
//                 "headers": {
//                     "Urgency": "high"
//                 }
//             }
//         }
//         const messaging =  admin.messaging();
//         await messaging.sendMulticast(message)
//             .then((response) => {
//                 //console.log(response);
//                 if (response.failureCount > 0) {
//                     const failedTokens: any = [];
//                     response.responses.forEach((resp, idx) => {
//                         if (!resp.success) {
//                             failedTokens.push(registrationTokens[idx])
//                         }
//                     });
//                     console.log('List of tokens that caused failures: ' + failedTokens)
//                     returnData = failedTokens
//                     return failedTokens
//                 }
//                 returnData = response;
//             }).catch(e =>{
//                 console.log(e);
//             });
//     } catch (e) {
//         returnData = false;
//         console.log(e);
//     }
//     return returnData;
// }
// // export async function fcmSend(req:Request, res:Response) {
// //     // const registrationToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMxMiwiaWF0IjoxNjU4MTI3ODIxLCJleHAiOjE2NjA3MTk4MjF9.-SJSQimotnnmQShc9-4QtAA8ngyScSbU0PThkq4uLy8';
// //     // const message = {
// //     //     data: {
// //     //       score: '850',
// //     //       time: '2:45'
// //     //     },
// //     //     token: registrationToken
// //     //   };
// //     //   const messaging =  admin.messaging();
// //     //   await messaging.send(message)
// //     //   .then((response) => {
// //     //     // Response is a message ID string.
// //     //     console.log('Successfully sent message:', response);
// //     //     return apiResponse.successResponseWithData(res, "Successfully sent message:", null)
// //     //   })
// //     //   .catch((error) => {
// //     //     console.log('Error sending message:', error);
// //     //     return
// //     //   });      
// // }
// // // export default async function fcmSend(notification:any, registrationTokens:any, extraData:any) {
// // //     if(!extraData){
// // //         extraData = null 
// // //     }   
// // //     let returnData = null;
// // // try{
// // // admin.initializeApp({
// // //     credential: admin.credential.cert(serviceAccount)
// // //   });
// // //   var registrationToken = "AAAApchRBZk:APA91bF2R_DZRSKM1Jfmd-Qvl2o-_CpypifM4Zx0HXxCiE1XT_-YbAH6yM33jd1PGLNRCQlAr0_rt6k6ROH7gJpwEasqCJCxvT8igroFc2zRHpk6X1KSX4GhULHDhQChiTOpJeedJLSn"
// // //   var payload = {
// // //     data: {
// // //         mykey: "cnsj",
// // //         "sound": "default"
// // //     }
// // //   };
// // //   var options = {
// // //     priority: "high",
// // //     timeToLive: 60 * 60 * 24
// // //   };
// // // admin.messaging().sendToDevice(registrationToken, payload, options)
// // // .then((response: any) => {
// // //     console.log("Successfully sent message:" ,response);
// // // })
// // // .catch((err) => {
// // //     console.log("error sending msg", err);
// // // })
// // // } catch (e) {
// // //     returnData = false;
// // //     console.log(e);
// // // }
// // // }
