const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')
const UserController = require('../controllers/UserController')


router.post('/signup', UserController.registerUser)
router.post('/login', UserController.loginUser)

router.use(requireAuth)

router.get('/', UserController.getAllUser)
router.get('/:id', UserController.getUser)
router.put('/:id', UserController.updateUser)
router.delete('/:id', UserController.deleteUser)

module.exports = router