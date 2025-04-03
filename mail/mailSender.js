const nodemailer = require('nodemailer')
require('dotenv').config();

const transport = nodemailer.createTransport({
    service:"gmail",
    secure:true,
    auth:{
        user:process.env.MAIL_HOST,
        pass:process.env.MAIL_PASSWORD,
    }
});
const sendEmail = async (sub,to,html)=>{
    try {
        const mailOptions = {
            from:{
                name:'Crawfish',
                address:process.env.MAIL_HOST
            },
            subject:sub,
            to,
            html
        };
        transport.verify((error, succes) => {
            if(error)
                console.log("error!!!! inside the helper", error)
            else{
                console.log("server is ready to send email", succes)
            }
        });
        const emailSend = transport.sendMail(mailOptions);
         return emailSend;

    } catch (error) {
     console.log('Error! can not send Email',error);
     return error
        
    }
};
module.exports = sendEmail