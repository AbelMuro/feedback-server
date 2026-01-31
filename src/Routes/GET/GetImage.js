const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../../Config/MySQL/db.js');
const {config} = require('dotenv');
config();

router.get('/get_image', async (req, res) => {
    try{
        const accessToken = req.cookies.accessToken;
        const JWT_SECRET = process.env.JWT_SECRET;
        const decodedToken = jwt.verify(accessToken, JWT_SECRET);
        const {image} = decodedToken;

        const [results] = await db.execute(
            'SELECT * FROM account_images WHERE id = ?',
            [image]
        )

        const imageData = results[0];
        const blob = imageData.data;
        const mimeType = imageData.mime_type;

        res.set('Content-Type', mimeType);
        res.send(blob)  
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;