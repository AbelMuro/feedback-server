const express = require('express');
const router = express.Router();

router.delete('/logout', (req, res) => {
    try{
        res.clearCookie('accessToken');
        res.status(200).send('User has logged out successfully');
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;