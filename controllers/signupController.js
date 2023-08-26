const path = require('path')
const Users = require('../models/user')
const bcrypt = require('bcrypt')

exports.signupPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'signup.html'))
}

exports.getsignupDetails = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const saltrounds = 10;
        const userExist = await Users.findOne({
            where: { email }
        })
        if (userExist) {
            return res.json({ message: "user already exist" })
        }
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            await Users.create({
                name: name,
                email: email,
                password: hash
            })
            res.status(200).json({ message: "user added succesfully" })
        })
    } catch (err) {
        res.status(500).json({ message: 'something went wrong' })
    }
}