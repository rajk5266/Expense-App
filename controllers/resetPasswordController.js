require("dotenv").config(); 
const uuid = require('uuid')
const SibApiV3Sdk = require("sib-api-v3-sdk");
const bcrypt = require("bcrypt");

const path = require('path')
const User = require('../models/user')
const ForgotPassword = require('../models/resetPassword');

const client = SibApiV3Sdk.ApiClient.instance;
const apikey = client.authentications["api-key"];
apikey.apiKey = "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"


exports.showforgotPasswordForm = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'forgotPasswordForm.html'))
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({
            where: { email }
        })
        if (user) {
            const id = uuid.v4()
            console.log(id)
            ForgotPassword.create({ id, userId: req.user, isactive: true })
                .catch(err => {
                    console.log("errrr",err)
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
            console.log('user does not exist')
            return res.status(404).json('user does not exist')
        }
    } catch (err) {
        // console.log(err)
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

exports.updatePassword = async (req, res) => {
    try{
        const{id, confirmPassword} = req.body;
        const forgotdetails = await ForgotPassword.findOne({
            where:{
                id
            }
        })
        forgotdetails.update({
            isactive: false
        })
        const userId = forgotdetails.userId;
        const user = await User.findOne({
            where: {
                id: userId
            }
        })
        if(user){
            const saltrounds = 10;
            bcrypt.hash(confirmPassword, saltrounds, async(err, hash) => {
                await user.update({
                    password: hash
                })
                res.status(200).json({message: "password updated succesfully"})
                
            })
        }
        else{
            res.status(404).json({message : 'user does not exist', success: false})
        }
    }catch(err){
        console.log(err)
    }
}

