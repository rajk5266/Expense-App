const express = require('express')

const router = express.Router()
const controller = require('../controllers/main')

router.get('/user', controller.signupPage )

router.post('/user/signup', controller.getsignupDetails)

module.exports = router