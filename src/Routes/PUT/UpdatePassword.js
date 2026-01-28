const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {config} = require('dotenv');
config();

router.put('/update_password', async (req, res) => {
    try{
        const {password} = req.body;
        const JWT_SECRET = process.env.JWT_SECRET;
        const accessToken = req.cookies.accessToken;
        if(!accessToken)
            return res.status(401).send('User is not logged in');
        const decodedToken = jwt.verify(accessToken, JWT_SECRET);
        const {id} = decodedToken;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [results] = await db.execute(
            'UPDATE accounts SET password = ? WHERE id = ?',
            [hashedPassword, id]
        );

        if(results.affectedRows === 1)
            res.status(200).send('Password has been updated');
        else
            res.status(401).send('Password was not updated');

    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;