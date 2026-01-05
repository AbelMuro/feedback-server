const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const db = require('../../Config/MySQL/db.js');

router.put('/reset_password', async(req, res) => {
    try{
        const {password, token} = req.body;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [results] = await db.execute(
            'SELECT * FROM accounts WHERE reset_token = ?',
            [hashedToken]
        );

        const account = results[0];
        if(!account){
            res.status(401).send('Reset token has expired');
            return;
        }
            
        const tokenExpiration = account.reset_token_expiration;

        if(tokenExpiration < Date.now()){
            res.status(401).send('Reset token has expired');
            return;
        }

        await db.execute(
            'UPDATE accounts SET reset_token = ?, reset_token_expiration = ?, password = ? WHERE reset_token = ?',
            [null, null, hashedPassword, hashedToken]
        );

        res.status(200).send('Password has been reset');

    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
})  

module.exports = router;