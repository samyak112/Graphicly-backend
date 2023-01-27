const express = require('express')
const router = express.Router()
const {authentication} = require('../../Middlewares/authentication')


const {verify} = require('../../Controllers/Verify/verify')

router.post('/',authentication,verify)

module.exports = router