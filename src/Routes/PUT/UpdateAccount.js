const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');

router.put('/update_account', async (req, res) => {
    try{
        const response = await db.execute(
            ''
        )
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
})