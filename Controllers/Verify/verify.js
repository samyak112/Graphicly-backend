const user = require('../../Models/users')
const generateOTP = require('../Signup/otp')
const updating_creds = require('../Signup/update_creds')

const verify = async (req, res) =>{
    const {email,otp,username} = req.body
    
    const data = await user.find({email:email})

    // if current time minus the time when user got the otp is less than 12000(2 minutes) then we check otp is correct or not
    current_time_stamp = data[0].verification[0].timestamp
    if (((Date.now())-current_time_stamp ) < 120000) {
        if(otp == data[0].verification[0].code){
            var new_val = { $set: { authorized: true } };
            user.updateOne({ email: email }, new_val, function (err, result) {
            if (err) throw err;
            else {res.status(201).json({message:'Congrats you are verified now' , status:201})}
            });
        }
        else{
            res.status(432).json({message:'incorrect passowrd' , status:432})
        }
    }
    // Changing otp as time limit is exceeded
    else {
        console.log('tle in verification')
        // updating time stamp value and generating new otp
        const otp = generateOTP()
        var new_val = { $set: { verification: [{
            timestamp:Date.now(),
            code:otp
        }]}};
        const response = await updating_creds(new_val , otp , email , username)
        console.log(response)
        if(response.status==201){
            res.status(442).json({message:'otp changed' , status:442})
        }
        else{
            res.status(404).json({message:'something went wrong' , status:404})
        }
    }
  }

  module.exports = {verify}