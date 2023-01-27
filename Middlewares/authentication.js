const jwt = require('jsonwebtoken')


const authentication = async(req,res,next)=>{
    try {
      const authHeader = req.headers['x-auth-token']
      const verified = jwt.verify(authHeader, process.env.ACCESS_TOKEN);
      next()
      
    } catch (err) {
      res.status(400).json({message:'not right',status:400});
    }
  }

module.exports = {authentication}