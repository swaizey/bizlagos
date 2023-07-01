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
    jobType:{
        type: String,
        required: true
    },
    img:{
        data:Buffer,
        contentType: String
    }
},{timestamps: true})

module.exports = mongoose.model('Listing', listingSchema)