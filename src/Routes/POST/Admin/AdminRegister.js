const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const db = require('../../../Config/MySQL/db.js');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage});

router.post('/admin_register', upload.single('image'), async (req, res) => {
    try{
        const {email, key, name} = req.body;
        const image = req.file;
        const accountId = crypto.randomUUID();

        let [allAdminKeys] = await db.execute('SELECT * FROM admin_keys');

        const rows = allAdminKeys.filter((row) => {
            return bcrypt.compareSync(key, row.key);
        });

        if(!rows.length)
            return res.status(404).send('Key is invalid, could not create admin account');

        const row = rows[0];
        const hashedKey = row.key;

        if(row.account_id) 
            return res.status(501).send('Key is already in use.')


        if(image){
            const imageId = crypto.randomUUID();
            await db.execute(
                'INSERT INTO account_images (id, account_id, filename, mime_type, size, data) VALUES (?, ?, ?, ?, ?, ?)',
                [imageId, accountId, image.originalname, image.mimetype, image.size, image.buffer]
            );

            await db.execute(
                'INSERT INTO accounts (id, email, name, image, password, admin) VALUES (?, ?, ?, ?, ?, ?)',
                [accountId, email, name, imageId, hashedKey, true]
            ) 
        }
        else{
            await db.execute(
                'INSERT INTO accounts (id, email, name, password, admin) VALUES (?, ?, ?, ?, ?, ?)',
                [accountId, email, name, hashedKey, true]
            )           
        }

        await db.execute(
            'UPDATE admin_keys SET account_id = ? WHERE `key` = ?',
            [accountId, hashedKey]
        )

        res.status(200).send('Admin account has been successfully created');
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;