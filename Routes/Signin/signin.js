const express = require('express')
const router = express.Router()


const {signin} = require('../../Controllers/Signin/signin')

router.post('/', signin)

module.exports = router