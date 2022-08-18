const express = require('express')
const { connection } = require('./DB/config')
const app = express()
require('dotenv').config()
app.use(express.json())
const port = process.env.PORT
connection()

const userRouter = require('./modules/user/user.router')
const productRouter = require('./modules/product/produc.router')
const socketInit = require('./services/socket_init')
app.use(userRouter,productRouter)
app.use('/uploads',express.static('uploads'))



const server =  app.listen(port, () => console.log(`Example app listening on port ${port}!`)) 
socketInit(server)