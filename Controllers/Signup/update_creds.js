const user = require('../../Models/users')
const send_mail  = require('./mail')


function updating_creds(account_creds,otp,email,username){
    return new Promise((resolve,reject)=>{
      user.updateOne({ email: email }, account_creds, function (err, result) {
        console.log('inside updating function')
        if (err) throw err;
        else {
          console.log('no error in updating creds')
        }
        send_mail(otp,email,username)
        const response = {message : 'updated' , status:201}
        resolve (response)
      });
    })
    
  }

  module.exports = updating_creds