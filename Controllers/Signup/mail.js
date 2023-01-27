const nodemailer = require('nodemailer');



// making transporter to send email
var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: process.env.user,
      pass: process.env.password
    }
  });
  
  function send_mail(otp,mail_value,name_value){
    var mailOptions = {
      from: process.env.user,
      to: mail_value,
      subject: 'Email for Verification',
      text: `Hello ${name_value}
      You registered an account on Code Editor, Here is your otp for verification - ${otp}
      Kind Regards, Samyak`
    };
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {console.log(error);} 
      else {console.log('Email sent: ' + info.response);}
    });
  }

  module.exports = send_mail