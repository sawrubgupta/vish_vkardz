import 'dotenv/config';

export default {
    smtp:{
        name:"mail.appitronsolutions.com",
        host:"mail.appitronsolutions.com", //process.env.SMTP_HOST, 
        secure: true,//true
        port: 465, //process.env.SMTP_PORT,//465
        secureConnection: false,
        // requireTLS: true,

        auth: {
            user: process.env.SMTP_USER,//"vishal@appitronsolutions.com", //, 
            pass: process.env.SMTP_PASSWORD, // "vishal123456", //, 
        },  // here it goes
        // tls: {
        //     // ciphers:'SSLv3',
        //     rejectUnauthorized: false
        // }
    },
    vcardLink: `https://vkardz.com/`,
    vkardUrl: `https://vkardz.com/`,
    apiBaseUrl: `https://api.vkardz.in/api/v2`,
    imgUrl: "https://vkardz.s3.ap-south-1.amazonaws.com/",

    AWS:{
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    webhookSecret: "",  

    websiteType: 'web',
    allUsers: 'all',
    activateUsers: 'activateUsers',
    deactivateUsers: 'deactivateUsers',
    basicPlan: 'basic',
    propersonalizePlan: 'propersonalize',
    proPlan: 'pro',
    productType: 'product',
    galleryType: 'gallery',
    profileType: 'profile',

    vcfType: 'vcf',
    vcfNumber: 'number',
    vcfPhone: 'phone',//not used in custom field
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
    businessType: 'business',

    referrerType: 'referrer',
    refereeType: 'referee',
    activeStatus: 'ACTIVE',
    redeemStatus: 'REDEEM',
    expiredStatus: 'EXPIRED',
    couponRedeem: 'COUPON_REEDEM',
    vKoin: 'vkoin',
    earnCoin: 'earn_coin',
    latlongDistance: 40,

    cardPurchase: 'purchase_card',
    cancelOrder: 'canceled',

    secretKey:"nss6DpYlq5CHw6Hn0jPqXJwtkHXuMDdYynDiRFNS6_Y", //process.env.SECRET,
    resumeLimit:10,
    vKardzPhone: "+91 6377256382",
    templateLimit:6,
    pageSize:21,
    memberType: 'member',
    ASSIGNEDStatus: "ASSIGNED",
    orderStatus: ["placed","processed","dispatched","delivered"],
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyOTQ1LCJpYXQiOjE2NzI3NTAyNTksImV4cCI6MTY3NTM0MjI1OX0.FijHwKIYVIBWnZbtWVry88FWnrejpu2HIWRDc_dKynw",
} 

// ====================================================================================================
// ====================================================================================================
