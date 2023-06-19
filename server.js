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


dbConnect()
app.use(cors(corsOptions))
app.use(express.json())

app.use('/user', UserRoute)
app.use('/listings', listingsRoutes )



mongoose.connection.once('open', () =>{
    console.log('Connected to DB')
    app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))
})
