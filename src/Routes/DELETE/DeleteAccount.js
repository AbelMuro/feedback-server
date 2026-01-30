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
        const {id, image} = decodedToken;

        const [accountDeletionResults] = await db.execute(
            'DELETE FROM accounts WHERE id = ?',
            [id]
        );

        if(!accountDeletionResults.affectedRows)
            return res.status(404).send('Account was not found in database')        

        if(image){
            const [imageDeletionResults] = await db.execute(
                'DELETE FROM account_images WHERE account_id = ?',
                [id]
            );
            if(!imageDeletionResults.affectedRows)
                return res.status(201).send('Account was deleted but account image could not be removed')                 
        }
  
       const [threadDeletionResults] = await db.execute(
            'DELETE FROM threads WHERE account_id = ?',
            [id]
       )

       if(!threadDeletionResults.affectedRows)
            return res.status(201).send('Account and image were removed, but the accounts threads could not be removed');
       

       const [threadMessageDeletionResults] = await db.execute(
            'DELETE FROM thread_messages WHERE thread_owner_id = ?',
            [id]
       )

       if(!threadMessageDeletionResults.affectedRows)
            return res.status(201).send('Account, image and threads were removed, but the thread_messages could not be removed')

       res.status(200).send('Account has been successfully deleted');

    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;