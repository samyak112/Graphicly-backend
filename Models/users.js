const mongoose = require('mongoose')

const users = mongoose.Schema({
    username:String,
    password:String,
    email:String,
    authorized:{
        type:Boolean,
        default:false
    },
    verification:[{
        timestamp:String,
        code:String,
    }],
})

module.exports = mongoose.model('Users', users)