const express = require('express');
const router = express.Router();
const controller = require('../controllers/login');

router.get('/user', controller.loginpage)

router.post('/api/login', controller.logindetails);

module.exports = router;