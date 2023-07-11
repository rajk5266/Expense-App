const express = require('express')

const router = express.Router()
const controller = require('../controllers/signupController')

router.get('/user/signup', controller.signupPage)

router.post('/user/signup', controller.getsignupDetails)

module.exports = router