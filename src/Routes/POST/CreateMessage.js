const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../../Config/MySQL/db.js');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
const {config} = require('dotenv');
config();

router.post('/create_message', async (req, res) => {
    try{
        const {message, threadId, threadOwnerId} = req.body;
        const JWT_SECRET = process.env.JWT_SECRET;
        const accessToken = req.cookies.accessToken;  
        const messageId = crypto.randomUUID();
        const created_at = String(new Date().getTime());
        const threadLink = `http://localhost:5173/thread/${threadId}`;

        if(!accessToken)
            return res.status(401).send('User is not logged in');

        const decodedToken = jwt.verify(accessToken, JWT_SECRET);
        const {id: messageOwnerId} = decodedToken;

        const [results] = await db.execute(
            'INSERT INTO thread_messages (id, message_owner_id, message, thread_id, thread_owner_id, created_at) VALUES (?, ?, ?, ?, ?, ?)',
            [messageId, messageOwnerId, message, threadId, threadOwnerId, created_at]
        );

        if(!results.affectedRows) 
            return res.status(501).send('Could not post message to thread');

        const [threadOwnerAccount] = await db.execute(
            'SELECT * FROM accounts WHERE id = ?',
            [threadOwnerId]
        );

        if(!threadOwnerAccount.length) 
            return res.status(201).send('Response has been recorded, but could not send email to thread owner')

        const threadOwnerEmail = threadOwnerAccount[0].email;

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            secure: true,
            port: 465,
            auth: {
                user: process.env.email,
                pass: process.env.app_password,
            }
        });

        const mailOptions = {
            from: process.env.email,
            to: threadOwnerEmail,
            subject: 'You have a new message to your feedback!',
            html: `
                <h1 style="font-size: 2rem">
                    Someone has replied to your feedback
                </h1>
                <p style="font-size: 1rem">
                    Please click on the link below to view the new message
                </p>
                <a href="${threadLink}" target="_blank" style="font-size: 1rem">
                    Click here
                </a>

            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).send('Response has been recorded');
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;