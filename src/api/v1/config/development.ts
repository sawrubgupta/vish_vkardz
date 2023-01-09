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
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyOTQ1LCJpYXQiOjE2NzI3NTAyNTksImV4cCI6MTY3NTM0MjI1OX0.FijHwKIYVIBWnZbtWVry88FWnrejpu2HIWRDc_dKynw"
} 

// ====================================================================================================
// ====================================================================================================
