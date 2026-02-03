const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../../Config/MySQL/db.js');
const {config} = require('dotenv');
config();

router.delete('/delete_account', async (req, res) => {
    try{
        const JWT_SECRET = process.env.JWT_SECRET;
        const accessToken = req.cookies.accessToken;

        if(!accessToken)
            return res.status(401).send('User is not logged in');

        const decodedToken = jwt.verify(accessToken, JWT_SECRET);
        const {id} = decodedToken;

        const [accountDeletionResults] = await db.execute(
            'DELETE FROM accounts WHERE id = ?',
            [id]
        );     

        await db.execute(
            'DELETE FROM account_images WHERE account_id = ?',
            [id]
        );             
        
        await db.execute(
            'DELETE FROM threads WHERE account_id = ?',
            [id]
        )
       
        await db.execute(
            'DELETE FROM thread_messages WHERE thread_owner_id = ?',
            [id]
        )

       res.clearCookie('accessToken');

       res.status(200).send('Account has been successfully deleted');

    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;