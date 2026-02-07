const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const db = require('../../Config/MySQL/db.js');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.post('/register_account', upload.single('image'), async (req, res) => {
    try{
        const {email, password, name} = req.body;    
        const image = req.file;        
        const accountId = crypto.randomUUID();
        const imageId = crypto.randomUUID();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.execute(
           image ? 'INSERT INTO accounts (id, email, password, name, image, admin) VALUES (?, ?, ?, ?, ?, ?)' : 'INSERT INTO accounts (id, email, password, name, admin) VALUES (?, ?, ?, ?, ?)',
           image ? [accountId, email, hashedPassword, name, imageId, false] : [accountId, email, hashedPassword, name, false]
        );
        if(image){
            await db.execute(
                'INSERT INTO account_images (id, account_id, filename, mime_type, data, size) VALUES (?, ?, ?, ?, ?, ?)',
                [imageId, accountId, image.originalname, image.mimetype, image.buffer, image.size]
            )            
        }

        res.status(200).send('Account has been successfully created');
    }
    catch(error){
        const message = error.message;
        const code = error.code;
        if(code === 'ER_DUP_ENTRY')
            res.status(401).send('Email is already registered');
        else
            res.status(500).send(message);
    }
})

module.exports = router;