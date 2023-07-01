const path = require('path')
const Users = require('../models/user')


exports.signupPage = (req, res) =>{
    res.sendFile(path.join(__dirname, '..', 'views', 'signup.html'))
}

exports.getsignupDetails = async (req, res) =>{
    // console.log(req.body)
    try{
        const {name, email, password} = req.body
        const userdetails = await Users.create({
            name: name,
            email: email,
            password: password
        })
        res.status(200).json({message: "user added succesfully"})
        
    }catch(err){
        if(err.name === 'SequelizeUniqueConstraintError' ){
            res.status(400).json({message: 'user already exists'})
        }else{
            res.status(500).json({ message: 'something went wrong'})
        }
    }
}