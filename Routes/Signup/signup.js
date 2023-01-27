const express = require('express')
const router = express.Router()


const {signup} = require('../../Controllers/Signup/signup')

router.post('/',signup)

module.exports = router