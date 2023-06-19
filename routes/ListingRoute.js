const express = require('express')
const listingsController = require('../controllers/listingsController')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

router.get('/', listingsController.getListings)
router.get('/:id', listingsController.getListing)
router.delete('/:id', listingsController.deletListing)

router.use(requireAuth)
router.post('/', listingsController.creatListing)

module.exports = router

    