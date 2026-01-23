const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../../Config/MySQL/db.js');
const jwt = require('jsonwebtoken');
const {config} = require('dotenv');
config();

/* 
    Watcher.add(
        'feedback database.thread_messages.thread_id.value'
    )
*/

router.post('/create_thread', async (req, res) => {
    try{
        const {title, feedback} = req.body;
        const id = crypto.randomUUID();
        const JWT_SECRET = process.env.JWT_SECRET;
        const accessToken = req.cookies.accessToken;

        if(!accessToken)
            return res.status(401).send('User is not logged in');
        
        const decodedToken = jwt.verify(accessToken, JWT_SECRET);
        const {id : accountId} = decodedToken;

        const [result] = await db.execute(
            'INSERT INTO threads (id, title, feedback, account_id) VALUES (?, ?, ?, ?)',
            [id, title, feedback, accountId]
        );

        res.status(200).send('Feedback has been submitted!');
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;