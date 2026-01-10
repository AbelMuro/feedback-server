const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {config} = require('dotenv');
const db = require('../../Config/MySQL/db.js');
config();

router.put('/update_account', async (req, res) => {
    try{
        const {email} = req.body;
        const JWT_SECRET = process.env.JWT_SECRET;
        const accessToken = req.cookies.accessToken;
        if(!accessToken) return res.status(401).send('User is not logged in');
        const decodedToken = jwt.verify(accessToken, JWT_SECRET);
        console.log(email, decodedToken);
        const accountId = decodedToken.id;

        const [results] = await db.execute(
            'UPDATE accounts SET email = ? WHERE id = ?',
            [email, accountId]
        );

        res.status(200).send('Account has been updated')
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;