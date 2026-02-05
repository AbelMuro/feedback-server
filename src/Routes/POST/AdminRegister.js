const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../../Config/MySQL/db.js');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage});


router.post('/admin_register', upload.single('image'), async (req, res) => {
    try{
        const {email, key, name} = req.body;
        const image = req.file;

        let [results] = await db.execute(
            'SELECT * FROM admin_accounts WHERE key = ?',
            [key]
        );

        if(!results.length)
            return res.status(404).send('Key is invalid, could not create admin account');

        if(file){
            const imageId = crypto.randomUUID();
            await db.execute(
                'INSERT INTO account_images (id, account_id, filename, mime_type, size, data) VALUES (?, ?, ?, ?, ?)',
                [imageId, key, image.filename, image.mimetype, image.size, image.data]
            );

            [results] = await db.execute(
                'UPDATE admin_accounts SET email = ?, name = ?, image = ? WHERE key = ?',
                [email, name, imageId, key]
            );
        }
        else{
            [results] = await db.execute(
                'UPDATE admin_accounts SET email = ?, name = ? WHERE key = ?',
                [email, name, key]
            );            
        }


        if(!results.affectedRows)
            return res.status(501).send('Could not create account');

        res.status(200).send('Admin account has been successfully created');
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;