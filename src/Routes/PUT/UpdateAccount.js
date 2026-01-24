const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../../Config/MySQL/db.js');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage});
const {config} = require('dotenv');
config();

router.put('/update_account', upload.single('image'), async (req, res) => {
    try{
        const {email, name} = req.body;
        const file = req.file;
        const JWT_SECRET = process.env.JWT_SECRET;
        const accessToken = req.cookies.accessToken;
        if(!accessToken) 
            return res.status(401).send('User is not logged in');
        const decodedToken = jwt.verify(accessToken, JWT_SECRET);
        const accountId = decodedToken.id;

        if(file){
            const imageId = crypto.randomUUID();

            await db.execute(
                'DELETE FROM account_images WHERE account_id = ?',
                [accountId]
            )
            await db.execute(
                'UPDATE account_images SET id = ?, filename = ?, mime_type = ?, size = ?, data = ? WHERE account_id = ?',
                [imageId, file.filename, file.mimetype, file.size, file.buffer, accountId]
            )
        }

        const [results] = await db.execute(
            'UPDATE accounts SET email = ?, name = ?, image WHERE id = ?',
            [email, accountId]
        );

        res.status(200).send('Account has been updated')
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;