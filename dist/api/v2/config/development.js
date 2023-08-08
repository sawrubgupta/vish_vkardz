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
    vcardLink: `https://vkardz.com/`,
    AWS: {
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    websiteType: 'web',
    allUsers: 'all',
    activateUsers: 'activateUsers',
    deactivateUsers: 'deactivateUsers',
    basicPlan: 'basic',
    propersonalizePlan: 'propersonalize',
    vcfType: 'vcf',
    vcfNumber: 'number',
    vcfPhone: 'phone',
    vcfAddress: 'address',
    vcfWebsite: 'website',
    vcfEmail: 'email',
    vcfCompany: 'company',
    vcfGender: 'gender',
    vcfDesignation: 'designation',
    vcfDepartment: 'department',
    vcfNotes: 'notes',
    vcfDob: 'dob',
    vcfName: 'name',
    otherType: 'other',
    socialType: 'social',
    contactType: 'contact',
    paymentType: 'payment',
    referrerType: 'referrer',
    refereeType: 'referee',
    activeStatus: 'ACTIVE',
    redeemStatus: 'REDEEM',
    expiredStatus: 'EXPIRED',
    couponRedeem: 'COUPON_REEDEM',
    secretKey: "nss6DpYlq5CHw6Hn0jPqXJwtkHXuMDdYynDiRFNS6_Y",
    resumeLimit: 10,
    vKardzPhone: "+91 6377256382",
    templateLimit: 6,
    pageSize: 20,
    businessType: 'business',
    memberType: 'member',
    ASSIGNEDStatus: "ASSIGNED",
    orderStatus: ["placed", "processed", "dispatched", "delivered"],
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyOTQ1LCJpYXQiOjE2NzI3NTAyNTksImV4cCI6MTY3NTM0MjI1OX0.FijHwKIYVIBWnZbtWVry88FWnrejpu2HIWRDc_dKynw",
};
// ====================================================================================================
// ====================================================================================================
