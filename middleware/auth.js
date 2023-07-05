
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = (req, res, next) =>{
    try{
        const token = req.header('Authorization');
         console.log('kkk')
        const {userId} = jwt.verify(token, 'jkfnsdfnifnipf')
        console.log(userId)
        User.findByPk(userId).then(user => {
            req.user = userId;
            next()
        })
        .catch(err => {
            console.log(err)
        })
    }catch(err){
        console.log(err)
        return res.status(401).json({success: false})
    }
}

module.exports = {auth}