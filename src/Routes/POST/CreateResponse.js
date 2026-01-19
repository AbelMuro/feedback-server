const express = require('express');
const router = express.Router();

router.post('/create_response', (req, res) => {
    try{

    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;