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
    const {userId, title, location, desc} = req.body
    try{
        const listing = await Listings.create({userId, title, location, desc})
        res.status(200).json(listing)
    }catch(err){
        res.status(400).json({error: err.message})
    }
}

//Update listing

const updateListings =  async (req, res) =>{
    const listingId = req.params.id
    const{currentUserId, currentAdminStatus} = req.body
    if(!mongoose.Types.ObjectId.isValid(listingId)){
        return res.status(404).json({error: 'No listing found'})
    }
    
        try{
            const listing = await Listings.findById(listingId)
            if(listing.userId === currentUserId || currentAdminStatus){
              await listing.updateOne({$set: req.body})
                res.status(200).json(listing)
        }else{
            return res.status(409).json({msg:"Can not update another users post"})
        }
    }catch(err){
            res.json(err)
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
    updateListings,
    deletListing
}