const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../../Config/MySQL/db.js');
const {config} = require('dotenv');
config();

router.get('/get_all_threads', async (req, res) => {
    try{
        const JWT_SECRET = process.env.JWT_SECRET;
        const accessToken = req.cookies.accessToken;

        if(!accessToken)
            return res.status(401).send('User is not logged in');

        const decodedToken = jwt.verify(accessToken, JWT_SECRET);
        const {id, admin : isAdmin} = decodedToken;
        let allThreads = [];

        if(isAdmin){
            const [results] = await db.execute(
                'SELECT * FROM threads'
            )
            allThreads = results;
        }
        else{
            const [results] = await db.execute(
                'SELECT * FROM threads WHERE account_id = ?',
                [id]
            );    
            allThreads = results;        
        }


        res.status(200).json(allThreads);
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;