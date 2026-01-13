const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../../Config/MySQL/db.js');
const {config} = require('dotenv');
config();

router.get('/get_account', async (req, res) => {
    try{
        const JWT_SECRET = process.env.JWT_SECRET;
        const accessToken = req.cookies.accessToken;

        if(!accessToken)
            return res.status(401).send('User is not logged in');

        const decodedToken = jwt.verify(accessToken, JWT_SECRET);
        const name = decodedToken.name;
        const email = decodedToken.email;

        res.status(200).json({name, email});
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;