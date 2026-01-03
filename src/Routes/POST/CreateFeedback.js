const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../../Config/MySQL/db.js');

router.post('/create_feedback', async (req, res) => {
    const {name, email, feedback} = req.body;
    const id = crypto.randomUUID();

    try{
        const [result] = await db.execute(
            'INSERT INTO feedback (id, email, name, feedback) VALUES (?, ?, ?, ?)',
            [id, name, email, feedback]
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