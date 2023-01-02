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
};
// ====================================================================================================
// ====================================================================================================
