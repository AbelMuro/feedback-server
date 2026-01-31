const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../../Config/MySQL/db.js');
const {config} = require('dotenv');
config();

router.get('/account_image', async (req, res) => {
    try{
        const JWT_SECRET = process.env.JWT_SECRET;
        const accessToken = req.cookies.accessToken;

        if(!accessToken)
            return res.status(401).send('User is not logged in');

        const decodedToken = jwt.verify(accessToken, JWT_SECRET);
        const imageId = decodedToken.image;

        if(!imageId)
            return res.status(404).send('Image not found');

        const [results] = await db.execute(
            'SELECT * FROM account_images WHERE id = ?',
            [imageId]
        );

        const imageData = results[0];
        const mimeType = imageData.mime_type;
        const data = imageData.data;

        res.set('Content-Type', mimeType);
        res.status(200).send(data)  
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;