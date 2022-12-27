import 'dotenv/config';

export default {
    smtp:{
        name:"noreply@vkardz.com",
        host:"mail.vkardz.com", //process.env.SMTP_HOST, 
        secure: true,//true
        port: 465,//465
        auth: {
            user: "noreply@vkardz.com", //process.env.SMTP_USER, 
            pass: "7)W}(-$8-yz$", //process.env.SMTP_PASSWORD, 
        },  // here it goes
        tls: {
            rejectUnauthorized: false
        }
    },
    
    secretKey:"nss6DpYlq5CHw6Hn0jPqXJwtkHXuMDdYynDiRFNS6_Y", //process.env.SECRET,
    resumeLimit:10,
    templateLimit:6,
    pageSize:20,
} 