const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
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
            await db.execute(
                'UPDATE account_images SET filename = ?, mime_type = ?, size = ?, data = ? WHERE account_id = ?',
                [file.originalname, file.mimetype, file.size, file.buffer, accountId]
            )
        }

        await db.execute(
            'UPDATE accounts SET email = ?, name = ? WHERE id = ?',
            [email, name, accountId]
        );

        const newAccessToken = jwt.sign({...decodedToken, email, name}, JWT_SECRET);
        res.cookie('accessToken', newAccessToken, {httpOnly: true, secure: true, sameSite: 'None'});
        res.status(200).send('Account has been updated')
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;