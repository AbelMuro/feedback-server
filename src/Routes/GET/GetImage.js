const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');
const {config} = require('dotenv');
config();

router.get('/get_image/:imageId', async (req, res) => {
    try{
        const imageId = req.params.imageId;
        const [results] = await db.execute(
            'SELECT * FROM account_images WHERE id = ?',
            [imageId]
        );

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