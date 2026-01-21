const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');

router.get('/get_thread/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const [results] = await db.execute(
            'SELECT * FROM threads WHERE id = ?',
            [id]
        );

        if(!results.length)
            return res.status(404).send('Feedback post not found');
        else
            return res.status(200).json(results);

    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;