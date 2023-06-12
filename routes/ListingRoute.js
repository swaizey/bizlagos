const express = require('express')
const listingsController = require('../controllers/listingsController')
const router = express.Router()

router.get('/', listingsController.getListings)
router.get('/:id', listingsController.getListing)
router.post('/', listingsController.creatListing)
router.patch('/:id', listingsController.updateListings)
router.delete('/:id', listingsController.deletListing)

module.exports = router

    