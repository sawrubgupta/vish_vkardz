import 'dotenv/config';

export default {
    smtp:{
        name:"noreply@vkardz.com",
        host:process.env.SMTP_HOST, 
        secure: true,//true
        port: 465,//465
        auth: {
            user: process.env.SMTP_USER, 
            pass: process.env.SMTP_PASSWORD, 
        },  // here it goes
        tls: {
            rejectUnauthorized: false
        }
    },
    
    secretKey:process.env.SECRET,
    resumeLimit:10,
    templateLimit:6,
    pageSize:20,
} 