const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../../Config/MySQL/db.js');
const jwt = require('jsonwebtoken');
const {config} = require('dotenv');
config();

router.post('/create_response', async (req, res) => {
    try{
        const {response, threadId} = req.body;
        const JWT_SECRET = process.env.JWT_SECRET;
        const accessToken = req.cookies.accessToken;
        const id = crypto.randomUUID();
        const created_at = String(new Date().getTime());

        if(!accessToken)
            return res.status(401).send('User is not logged in');

        const decodedToken = jwt.verify(accessToken, JWT_SECRET);
        const {name, image} = decodedToken;

        await db.execute(
            'INSERT INTO thread_responses (id, name, image, response, thread_id, created_at) VALUES (?, ?, ?, ?, ?, ?)',
            [id, name, image, response, threadId, created_at]
        );

        res.status(200).send('Response has been recorded');

    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;