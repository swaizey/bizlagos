const Listings = require('../models/listingModel')
const mongoose = require('mongoose')

//Get all listing
const getListings = async (req, res) =>{
    const listings = await Listings.find({}).sort({createdAt: -1})
    if(listings.length == 0){
        return res.status(400).json({msg: 'No listings'})
    }
    res.status(200).json(listings)
}

//Get single listing
const getListing = async (req, res) =>{
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No listing found'})
    }

    const listing = await Listings.findById(id)

    if(!listing){
        return res.status(400).json({error: 'No listing sound'})
    }
    res.status(200).json(listing)
}


/// Create a Listing
const creatListing = async (req, res) =>{
    const {user_id, title, location, desc, job} = req.body

    let emptyFields = []
    if(!title){
        emptyFields.push('title')
    }
    if(!location){
        emptyFields.push('location')
    }
    if(!desc){
        emptyFields.push('desc')
    }
    if(emptyFields.length > 0){
        return res.status(400).json({error:'Please fill all fields', emptyFields})
    }
    try{
        const user_id = req.user._id

        const listing = await Listings.create({user_id, title, location, desc, job})
        res.status(200).json(listing)
    }catch(err){
        res.status(400).json({error: err.message})
    }
}


//Delete listing
const deletListing = async (req, res) =>{
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No listing found'})
    }
    const listing = await Listings.findOneAndDelete({ _id: id})
    if(!listing){
        return res.status(404).json({error: 'No listing'})
    }
    res.status(200).json(listing)
}

module.exports = {
    getListings,
    getListing,
    creatListing,
    deletListing
}