const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const db = require('../../Config/MySQL/db.js');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage});


router.post('/admin_register', upload.single('image'), async (req, res) => {
    try{
        const {email, key, name} = req.body;
        const image = req.file;
        const accountId = crypto.randomUUID();

        let [allAdminAccounts] = await db.execute('SELECT * FROM admin_accounts');

        const allAccounts = allAdminAccounts.filter((account) => {
            return bcrypt.compareSync(key, account.key);
        });

        if(!allAccounts.length)
            return res.status(404).send('Key is invalid, could not create admin account');

        const account = allAccounts[0];


        if(image){
            const imageId = crypto.randomUUID();
            await db.execute(
                'INSERT INTO account_images (id, account_id, filename, mime_type, size, data) VALUES (?, ?, ?, ?, ?, ?)',
                [imageId, account.key, image.originalname, image.mimetype, image.size, image.buffer]
            );

            await db.execute(
                'UPDATE admin_accounts SET email = ?, name = ?, image = ?, id = ? WHERE `key` = ?',
                [email, name, imageId, accountId, account.key]
            );
        }
        else{
            await db.execute(
                'UPDATE admin_accounts SET email = ?, name = ?, id = ? WHERE `key` = ?',
                [email, name, accountId, account.key]
            );            
        }

        res.status(200).send('Admin account has been successfully created');
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;