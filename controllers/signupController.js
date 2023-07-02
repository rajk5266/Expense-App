const path = require('path')
const Users = require('../models/user')
const bcrypt = require('bcrypt')


exports.signupPage = (req, res) =>{
    res.sendFile(path.join(__dirname, '..', 'views', 'signup.html'))
}

exports.getsignupDetails = async (req, res) =>{
    try{
        const {name, email, password} = req.body;
        const saltrounds  = 10;
        bcrypt.hash(password, saltrounds, async(err, hash) =>{
            await Users.create({
                name: name,
                email: email,
                password: hash
            })
            res.status(200).json({message: "user added succesfully"})
        })
    }catch(err){
        if(err.name === 'SequelizeUniqueConstraintError' ){
            res.status(400).json({message: 'user already exists'})
        }else{
            res.status(500).json({ message: 'something went wrong'})
        }
    }
}