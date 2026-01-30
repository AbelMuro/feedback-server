const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../Config/MySQL/db.js');
const {config} = require('dotenv');
config();


router.put('/login', async (req, res) => {

    try{
        const {email, password} = req.body;
        const JWT_SECRET = process.env.JWT_SECRET;

        const [results] = await db.execute(
            'SELECT * FROM accounts WHERE email = ?',
            [email]
        )

        if(!results.length)
            return res.status(401).send('Email is not registered');
        

        const account = results[0];
        const hashedPassword = account.password;
        const passwordsMatch = await bcrypt.compare(password, hashedPassword);

        if(!passwordsMatch){
            res.status(401).send('Credentials are invalid');
            return;
        }

        const token = jwt.sign({...account}, JWT_SECRET);
        res.cookie('accessToken', token, {httpOnly: true, secure: true, sameSite: 'None'});
        res.status(200).send('User has successfully logged in');

    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;