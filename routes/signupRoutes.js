const express = require('express')

const router = express.Router()
const controller = require('../controllers/signup')


router.get('/user/signup', controller.signupPage)

router.post('/user/signup', controller.getsignupDetails)

module.exports = router