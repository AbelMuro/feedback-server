const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const db = require('../../Config/MySQL/db.js');
const router = express.Router();

router.post('/register_account', async (req, res) => {
    try{
        const {email, password} = req.body;       
        const id = crypto.randomUUID();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await db.execute(
            'INSERT INTO accounts (id, email, password) VALUES (?, ?, ?)',
            [id, email, hashedPassword]
        );

        res.status(200).send('Account has been successfully created');
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
})

module.exports = router;