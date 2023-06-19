const mongoose = require('mongoose')

const listingSchema = new mongoose.Schema({
    user_id:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    desc:{
        type: String,
        required: true
    },
    job:{
        type: String,
        required: true
    }
},{timestamps: true})

module.exports = mongoose.model('Listing', listingSchema)