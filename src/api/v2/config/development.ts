import 'dotenv/config';

export default {
    smtp:{
        name:"noreply@vkardz.com",
        host:"mail.appitronsolutions.com", //process.env.SMTP_HOST, 
        secure: true,//true
        port: 465,//465
        auth: {
            user: "vishal@appitronsolutions.com", //process.env.SMTP_USER, 
            pass: "vishal123456", //process.env.SMTP_PASSWORD, 
        },  // here it goes
        tls: {
            rejectUnauthorized: false
        }
    },
    vcardLink: `https://vkardz.com/`,

    AWS:{
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },

    allUsers: 'all',
    activateUsers: 'activateUsers',
    deactivateUsers: 'deactivateUsers',
    basicPlan: 'basic',
    propersonalizePlan: 'propersonalize',

    vcfNumber: 'number',
    vcfPhone: 'phone',//not used in custom field
    vcfAddress: 'address',
    vcfWebsite: 'website',
    vcfEmail: 'email',
    vcfCompany: 'company',

    referrerType: 'referrer',
    refereeType: 'referee',
    activeStatus: 'ACTIVE',
    redeemStatus: 'REDEEM',
    expiredStatus: 'EXPIRED',
    couponRedeem: 'COUPON_REEDEM',

    secretKey:"nss6DpYlq5CHw6Hn0jPqXJwtkHXuMDdYynDiRFNS6_Y", //process.env.SECRET,
    resumeLimit:10,
    vKardzPhone: "+91 6377256382",
    templateLimit:6,
    pageSize:20,
    businessType: 'business',
    memberType: 'member',
    ASSIGNEDStatus: "ASSIGNED",
    orderStatus: ["placed","processed","dispatched","delivered"],
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyOTQ1LCJpYXQiOjE2NzI3NTAyNTksImV4cCI6MTY3NTM0MjI1OX0.FijHwKIYVIBWnZbtWVry88FWnrejpu2HIWRDc_dKynw",
} 

// ====================================================================================================
// ====================================================================================================
