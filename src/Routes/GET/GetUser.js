const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');


router.get('/get_user/:accountId', async (req, res) => {
    try{
        const accountId = req.params.accountId;

        const [results] = await db.execute(
            'SELECT * FROM accounts WHERE id = ?',
            [accountId],
        );

        if(!results.length)
            return res.status(404).send('Could not find account in database');
        
        const account = results[0];
        const name = account.name;
        const imageId = account.image;    

        res.status(200).json({
            name, imageId
        })
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;