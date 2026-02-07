const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {config} = require('dotenv');
config()

router.put('/admin_login', async (req, res) => {
    try{
        const {email, key} = req.body;
        const JWT_SECRET = process.env.JWT_SECRET;
 
        const [results] = await db.execute(
            'SELECT * FROM admin_accounts WHERE email = ?',
            [email]
        );

        const account = results[0];
        if(!account) 
            return res.status(404).send('Account was not found in database');
        const hashedKey = account.key;
        const matches = await bcrypt.compare(key, hashedKey)

        if(!matches)
            return res.status(401).send('Credentials are invalid');

        const accessToken = jwt.sign({...account}, JWT_SECRET);
        res.cookie('accessToken', accessToken, {httpOnly: true, secure: true, sameSite: 'None'});
        res.status(200).send('Admin user has logged in')
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;