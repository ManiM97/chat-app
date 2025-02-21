const express = require('express')
const {Server} = require('socketio')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
const io = new Server(Server, {cors:{origin: "*"}})

app.use(cors)
app.use(express.json())

mongoose.connect('mongodb+srv://ekadantamani1997:Mani1997@ecommerce.q4szc.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce')

app.listen(1997, () => {
    console.log("SERVER IS CONNECTED TO THIS PORT"+1997)    
})