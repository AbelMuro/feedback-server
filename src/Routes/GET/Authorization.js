const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {config} = require('dotenv');
config();

router.get('/authorization', (req, res) => {
    try{
        const JWT_SECRET = process.env.JWT_SECRET;
        const accessToken = req.cookies.accessToken;

        if(!accessToken)
             return res.status(401).send('User is not logged in');

        const decodedToken = jwt.verify(accessToken, JWT_SECRET);
        const key = decodedToken.key;

        if(key)
            return res.status(201).send('User is an administrator');
        else
            return res.status(200).send('User is logged in');

    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;