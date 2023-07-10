// const uuid = require('uuid')
const SibApiV3Sdk = require("sib-api-v3-sdk"); 
// const bcrypt = require("bcrypt"); 
const dotenv = require("dotenv").config(); 

const path = require('path')
const User = require('../models/user')
const ForgotPassword = require('../models/forgotPassword');

const client = SibApiV3Sdk.ApiClient.instance; 
const apikey = client.authentications["api-key"]; 
apikey.apiKey = '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'; 

exports.showResetPasswordForm = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'resetPassword.html'))
}

exports.sendLink = async (req, res) => {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        const sender = {
            email: "kushwaharaj903@gmail.com",
            name: "RAJ KUSHWAHA"
        };
        const receivers = [
            {
                email: req.body.email
            }
        ]
            try{
           const sendEmail = await apiInstance.sendTransacEmail({
            sender,
            to: receivers,
            subject: "test email from brevo",
            textContent: "test email",
            htmlContent: `<p>Hello,</p> 
            <p>Please click the following link to reset your password:</p> 
            <p><a href="http://15.206.28.85:3000/password/resetpassword/">Reset password</a></p> 
            <p>If you did not request a password reset, please ignore this email.</p> 
            <p>Thank you!</p>`, 
    
           });
           return res.send(sendEmail) 
        } catch (err) {
        console.log(err)
    }
}

