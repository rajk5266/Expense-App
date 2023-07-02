const path = require('path')
const Users = require('../models/user')
const bcrypt = require('bcrypt')

exports.loginpage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'))
}


exports.logindetails = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await Users.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      } else {
        const passwordMatching = await bcrypt.compare(password, user.password);
        if (passwordMatching) {
          return res.status(200).json({ success: true, message: 'Logged in successfully' });
        } else {
          return res.status(400).json({ success: false, message: 'Incorrect password' });
        }
      }
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  


