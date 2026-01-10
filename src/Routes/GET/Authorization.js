const express = require('express');
const router = express.Router();

router.get('/authorization', (req, res) => {
    try{
        const accessToken = req.cookies.accessToken;
        console.log(accessToken);

        if(accessToken)
            res.status(200).send('User is logged in');
        else
            res.status(401).send('User is not logged in');
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;