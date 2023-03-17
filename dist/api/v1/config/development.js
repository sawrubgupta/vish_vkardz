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
    secretKey: "nss6DpYlq5CHw6Hn0jPqXJwtkHXuMDdYynDiRFNS6_Y",
    resumeLimit: 10,
    templateLimit: 6,
    pageSize: 20,
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyOTQ1LCJpYXQiOjE2NzI3NTAyNTksImV4cCI6MTY3NTM0MjI1OX0.FijHwKIYVIBWnZbtWVry88FWnrejpu2HIWRDc_dKynw"
};
// ====================================================================================================
// ====================================================================================================
