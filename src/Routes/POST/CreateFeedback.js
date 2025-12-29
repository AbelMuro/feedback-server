const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');

router.post('/create_feedback', (req, res) => {
    const {name, email, feedback, rating} = req.body;

    try{

    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
})