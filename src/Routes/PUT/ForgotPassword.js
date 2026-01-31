const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const {config} = require('dotenv');
config();

router.put('/forgot_password', async (req, res) => {

    try{
        const {email} = req.body;

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const resetExpiration = Date.now() + 10 * 60 * 1000;
        const resetLink = `http://localhost:5173/reset_password/${resetToken}`;        

        const [results] = await db.execute(
            'UPDATE accounts SET reset_token = ?, reset_token_expiration = ? WHERE email = ? ',
            [resetPasswordToken, resetExpiration, email]
        );   

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            secure: true,
            port: 465,
            auth: {
                user: process.env.email,
                pass: process.env.app_password
            }
        });

        const mailOptions = {
            from: process.env.email,
            to: email,
            subject: 'Reset link for feedback app',
            text: `Please click on the following link to reset your password ${resetLink}`
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                res.status(401).send(error.message);
                return;
            }

            res.status(200).send('Email sent successfully');
        })

    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }



});

module.exports = router;