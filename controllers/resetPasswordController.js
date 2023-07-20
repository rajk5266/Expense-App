require("dotenv").config(); 
const uuid = require('uuid')
const SibApiV3Sdk = require("sib-api-v3-sdk");
const bcrypt = require("bcrypt");

const path = require('path')
const User = require('../models/user')
const ForgotPassword = require('../models/resetPassword');

const client = SibApiV3Sdk.ApiClient.instance;
const apikey = client.authentications["api-key"];
apikey.apiKey = process.env.BREVO_API


exports.showforgotPasswordForm = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'forgotPasswordForm.html'))
}

exports.forgotPassword = async (req, res) => {
    try {
        console.log("req.user",req.user)
        const { email } = req.body
        const user = await User.findOne({
            where: { email }
        })
        if (user) {
            const id = uuid.v4()
            ForgotPassword.create({ id, userId: req.user, isactive: true })
                .catch(err => {
                    console.log(err)
                })
            const sendinblue = new SibApiV3Sdk.TransactionalEmailsApi();
            const sendSmtpemail = {
                to: [{ email }],
                sender: {
                    email: "kushwaharaj903@gmail.com",
                    name: "RAJ KUSHWAHA",
                },
                subject: "reset your password",
                htmlContent: `<p>Hello,</p> 
                       <p>Please click the following link to reset your password:</p> 
                       <p><a href="http://localhost:9000/password/resetpassword/${id}">Reset password</a></p> 
                       <p>If you did not request a password reset, please ignore this email.</p> 
                       <p>Thank you!</p>`,
            }
            await sendinblue.sendTransacEmail(sendSmtpemail);
            return res.status(200).json({ message: "link has been send to reset password", success: true })
        }
        else {
            console.log('user doesnpt exist')
            return res.status(404).json('user does not exist')
        }
    } catch (err) {
        console.log(err)
        return res.json({ message: err, success: false })
    }
}

exports.showResetPasswordForm = async (req, res) => {
    try {
        const id = req.params.id
        const idExist = await ForgotPassword.findOne({
            where: {
                id,
                isactive: true
            }
        })
     
        res.sendFile(path.join(__dirname, '..', 'public', 'resetPassword.html'))
    } catch (err) {
        console.log(err)
    }
}

// exports.updatePassword = async (req, res) => {
//     try{
//         const{id, confirmPassword} = req.body;
//         const forgotdetails = await ForgotPassword.findOne({
//             where:{
//                 id
//             }
//         })
//         console.log("---->", forgotdetails)
//        await forgotdetails.update({
//             isactive: false
//         })
//         const userId = forgotdetails.userId;
//         const user = await User.findOne({
//             where: {
//                 id: userId
//             }
//         })
//         if(user){
//             const saltrounds = 10;
//           const hash = bcrypt.hash(confirmPassword, saltrounds, async(err, hash) => {
//                 await user.update({
//                     password: hash
//                 })
//                 res.status(200).json({message: "password updated succesfully"})
                
//             })
//         }
//         else{
//             res.status(404).json({message : 'user does not exist', success: false})
//         }
//     }catch(err){
//         console.log(err)
//     }
// }


exports.updatePassword = async (req, res) => {
    try{
        console.log(req.user, "req.userrr")
        const{id, confirmPassword} = req.body;
        console.log("id", id, "---", confirmPassword)
        const forgotdetails = await ForgotPassword.findOne({
            where:{
                id
            }
        })
        console.log(forgotdetails)
        forgotdetails.update({
            isactive: false
        })
        const userId = forgotdetails.userId;
        console.log("userID---> ", userId)
        const user = await User.findOne({
            where: {
                id: userId
            }
        })
        console.log("userrr", user)
        if (user) {
            const saltrounds = 10;
            const hash = await bcrypt.hash(confirmPassword, saltrounds);
            console.log("hash", hash)
            await user.update({
                password: hash
            });

            res.status(200).json({ message: "password updated successfully" });
        }
        else{
            res.status(404).json({message : 'user does not exist', success: false})
        }
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "internal server error", success: false });
    }
}
