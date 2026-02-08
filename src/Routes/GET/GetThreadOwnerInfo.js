const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');

router.get('/get_thread_owner_info/:threadId', async (req, res) => {
    try{
        const threadId = req.params.threadId;
        console.log(threadId);
        const [threads] = await db.execute(
            'SELECT * FROM threads WHERE id = ?',
            [threadId]
        );

        if(!threads.length)
            return res.status(404).send('Thread was not found in database');

        const accountId = threads[0].account_id;

        const [threadOwner] = await db.execute(
            'SELECT * FROM accounts WHERE id = ?',
            [accountId]
        );

        if(!threadOwner.length)
            return res.status(404).send('Account was not found in database');

        const name = threadOwner[0].name;
        const image = threadOwner[0].image;

        res.status(200).json({
            name, image
        });
    }
    catch(error){
        const message = error.message;
        console.log(message);
    }
});

module.exports = router;