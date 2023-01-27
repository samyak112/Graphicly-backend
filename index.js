const express = require('express')
const app = express()
const http = require('http')
require('dotenv').config()
const port = process.env.PORT || 3090;
const connect_db = require('./Config/db')
const cors = require('cors')


connect_db()
app.use(cors())
app.use(express.json({limit:'10kb'}))
app.use(express.urlencoded({extended:true,limit:'10kb'}))

const server = app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

app.use('/signin' , require('./Routes/Signin/signin'));
app.use('/signup' , require('./Routes/Signup/signup'));
app.use('/verify' , require('./Routes/Verify/verify'));
app.use('/verification_route' , require('./Routes/Verify_route/verify_route'));

