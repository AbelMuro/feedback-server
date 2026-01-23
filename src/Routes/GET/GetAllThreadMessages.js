const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');

router.get('/get_all_thread_messages/:id', async (req, res) => {
    try{
        const threadId = req.params.id;
        const [results] = await db.execute(
            'SELECT * FROM thread_messages WHERE thread_id = ?',
            [threadId]
        )
        res.status(200).json(results);
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }

});

module.exports = router;