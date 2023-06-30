const express = require('express')
const path = require('path')
const router = express.Router()

router.get('/user', (req, res) =>{
    // console.log(req.body)
    res.sendFile(path.join(__dirname, '..', 'views', 'signup.html'))
})

router.post('/user/signup', (req, res) =>{
    console.log(req.body)
})

module.exports = router