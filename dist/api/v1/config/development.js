"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
exports.default = {
    smtp: {
        name: "noreply@vkardz.com",
        host: "mail.vkardz.com",
        secure: true,
        port: 465,
        auth: {
            user: "noreply@vkardz.com",
            pass: "7)W}(-$8-yz$", //process.env.SMTP_PASSWORD, 
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
