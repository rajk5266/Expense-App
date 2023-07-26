const express = require('express')

const router = express.Router()
const controller = require('../controllers/signup')

router.get('/signup', controller.signupPage)

router.post('/signup', controller.getsignupDetails)

module.exports = router