require('dotenv').config()
const express = require('express')
const corsOptions = require('./config/corseOptions')
const PORT = process.env.PORT || 4000
const listingsRoutes = require('./routes/ListingRoute')
const UserRoute = require('./routes/UserRoute')
const cors = require('cors')
const app = express()
const dbConnect = require('./config/DBConnect')
const mongoose = require('mongoose')
const ChatRoute = require("./routes/ChatRoute")
const MessageRoute = require('./routes/MessageRoute')
const multer = require('multer')
const bodyParser = require('body-parser')

dbConnect()
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


app.use('/user', UserRoute)
app.use('/listings', listingsRoutes )

app.use('/chat', ChatRoute)
app.use('/message', MessageRoute)



mongoose.connection.once('open', () =>{
    console.log('Connected to DB')
    app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))
})
