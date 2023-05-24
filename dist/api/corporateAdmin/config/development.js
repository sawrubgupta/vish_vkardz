"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
exports.default = {
    smtp: {
        name: "noreply@vkardz.com",
        host: "mail.appitronsolutions.com",
        secure: true,
        port: 465,
        auth: {
            user: "vishal@appitronsolutions.com",
            pass: "vishal123456", //process.env.SMTP_PASSWORD, 
        },
        tls: {
            rejectUnauthorized: false
        }
    },
    AWS: {
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    BUCKET_NAME: "imagefurb",
    ASSIGNEDStatus: "ASSIGNED",
    vcardLink: `https://vkardz.com/`,
    secretKey: "nss6DpYlq5CHw6Hn0jPqXJwtkHXuMDdYynDiRFNS6_Y",
    resumeLimit: 10,
    vKardzPhone: "+91 6377256382",
    templateLimit: 6,
    pageSize: 20,
    businessType: 'business',
    memberType: 'member',
    orderStatus: ["placed", "processed", "dispatched", "delivered"],
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyOTQ1LCJpYXQiOjE2NzI3NTAyNTksImV4cCI6MTY3NTM0MjI1OX0.FijHwKIYVIBWnZbtWVry88FWnrejpu2HIWRDc_dKynw",
};
// ====================================================================================================
// ====================================================================================================
