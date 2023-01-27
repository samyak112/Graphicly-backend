const jwt = require('jsonwebtoken')
const user = require('../../Models/users')


const signin = async(req, res)=> {
    console.log('entered')
    const {email,password} = req.body

    const data = await user.find({email:email})
    

    if (data.length == 0) {
        res.status(442).json({error:'invalid username or password',status:442})
    }
    else {
        if (password == data[0].password) {
            if (data[0].authorized == true) {
                const token = jwt.sign({id:data[0].id , username:data[0].username ,email:data[0].email},process.env.ACCESS_TOKEN)
                res.status(201).json({message:'you are verified',status:201 , token:token});
            }
            else {
                res.status(422).json({error:'you are not verified yet',status:422});
            }
        }

    else {
        res.status(442).json({error:'invalid username or password',status:442});
        }
    }
    
  }

module.exports = {
    signin
}