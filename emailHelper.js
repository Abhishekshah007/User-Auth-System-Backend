"use strict";
const nodemailer = require("nodemailer");

const mailHelper = async (options) => {


    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "becfa77f693300",
          pass: "f019a26047021d"
        }
      });

   // send mail with defined transport object

   const message = {
    from: 'amitkumarshah499@gmail.com', // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.msg, // plain text body
    
  };
  
  await transport.sendMail(message);

}

module.exports = mailHelper;