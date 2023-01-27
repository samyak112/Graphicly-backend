const user = require('../../Models/users')
const generateOTP = require('./otp')
const send_mail  = require('./mail')
const updating_creds = require('./update_creds')

function register(email,username,password){
    return new Promise((resolve,reject)=>{
      user.find({ email: email }, function (err, data) {
        if (data.length == 0) {
          // this if condition validates the form in case js is off in some browser it also checks if password length is less than 7
          if(username== '' || email=='' || password ==''){
            console.log('entries wrong')
            const response = {message:'wrong input', status : 204};
            resolve(response) ;
          }
          else if(password.length<7){
            console.log('password length not enough')
            const response = {message:'password length', status : 400};
            resolve(response) ;
          }
          else{
            const response = {message:true};
            resolve (response);
          }
        }
        else {
          if(data[0].authorized == true){
            console.log('user already exists')
            const response = {message:'user already exists', status : 202};
            resolve(response) ;
            // res.status(202).json({message:'user already exists' , status : 202})
          }
          else{
            current_time_stamp =  data[0].verification[0].timestamp
            if(data[0].username != username && ((Date.now())-current_time_stamp ) < 120000){
              // TLE = time limit exceeded
              const response = {message:'not_TLE' , otp:data[0].verification[0].code};
              resolve(response) ;
            }
    
            //updated account creds without changing otp because otp is not expired yet and someone tried to fill the form again with same email address
            else if( data[0].username == username && ((Date.now())-current_time_stamp ) < 120000){
              const response = {message:'not_TLE_2' , otp:data[0].verification[0].code};
              resolve (response) ;
            }
    
            //updated account creds with changing otp because otp is expired and someone tried to fill the form again with same email address
            else if( data[0].username == username && ((Date.now())-current_time_stamp ) > 120000){
              const response = {message:'TLE'};
              resolve (response) ;
            }
    
            else if( data[0].username != username && ((Date.now())-current_time_stamp ) > 120000){
              const response = {message:'TLE_2'};
              resolve (response) ;
            }
          }
        }
      })
    })  
    
  }

const signup = async (req,res)=>{
    const {email , username , password} = req.body

    let response = await register(email,username,password);

    if(response.status == 204 || response.status == 400 || response.status == 202){
        let status = response.status
        res.status(status).json({message:response.message , status : status})
    }

    // new user
    else if(response.message == true){
        const otp = generateOTP();

        // here we saved those values in the new user to be saved in database 
        var new_user = new user({ username: username, email:email, password:password,verification : [{
        timestamp : Date.now(),
        code:otp
        }] });

        // if the user doesnot exist we send a verification code to verify that the email entered is not fake 
        send_mail(otp,email,username)

        // here we saved users details
        new_user.save(function (err_2, data_2) {
        if (err_2) return console.error(err_2);
        else { }
        });
        res.status(201).json({message:'data saved',status:201});
    }

    else if(response.message == 'not_TLE' || response.message == 'TLE_2'){
        var account_creds = { $set: { username: username, email: email, password: password} };
        var otp = 0;
        // username not equal and tl not exceeded
        if(response.message == 'not_TLE'){
        var otp = response.otp
        }
        
        // username not equal and tl exceeded
        else{
        var otp = generateOTP()
        }

        let new_response = await updating_creds(account_creds,otp,email,username)
        let status = new_response.status
        res.status(status).json({message:new_response.message , status : status})
    }

    else if(response.message == 'not_TLE_2' || response.message == 'TLE'){
        var otp = 0;

        // username equal and tl not exceeded
        if(response.message == 'not_TLE_2'){
        var account_creds = { $set: { username: username,email: email, password: password} };
        var otp = response.otp
        }

        // username equal and tl exceeded
        else{
        var otp = generateOTP()
        var account_creds = { $set: { username: username,email: email,password: password,verification:[{
            timestamp:Date.now(),
            code: otp
        }]} };
        }
        
        let new_response = await updating_creds(account_creds , otp , email , username)
        let status = new_response.status
        res.status(status).json({message:new_response.message , status : status})
    }



}

module.exports = {
    signup
}