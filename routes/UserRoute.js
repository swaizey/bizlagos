const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')

router.get('/:id', UserController.getUser)
router.post('/', UserController.registerUser)
router.post('/register', UserController.registerUser)
router.put('/:id', UserController.updateUser)
router.delete('/:id', UserController.deleteUser)

module.exports = router