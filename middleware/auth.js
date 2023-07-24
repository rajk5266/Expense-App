const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = (req, res, next) =>{
    try{
        // console.log(req.user, "middlewarechecking")
        const token = req.header('Authorization');
      
        const {userId} = jwt.verify(token, 'jkfnsdfnifnipf')
       
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