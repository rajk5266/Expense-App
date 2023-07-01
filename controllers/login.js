const path = require('path')
const Users = require('../models/user')


exports.loginpage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'))
}


exports.logindetails = async (req, res) => {
    const { email, password } = req.body
    try {

        const users = await Users.findOne({ where: { email}  });
        if (users === null) {
           return  res.json({message: "user doesn't exist"})
        } 

         else{
           const response  = await  Users.findOne({
            where:{
                email:email,
                password: password
            }
           })
           if(!response){
            return res.json({message: "incorret password"})
           }else{
            res.json({message: "logged in successfully"})
           }
         }
        
    } catch (err) {
        res.json({message : err.message})

    }
}


