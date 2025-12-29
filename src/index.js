const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;


/* 
    this is where i left off, i am currently trying to design the columns for the tables in database
    with mysql workbench
*/

app.use(express.json());
app.use(cors({
    origin: '*',
    allowedHeaders: ['Authorization', 'Content-Type'],
    methods: ['POST', 'PUT', 'DELETE'],
}));


app.get('/', (req, res) => {
    res.send('hello world');
});

app.listen(port, (error) => {
    if(error){
        console.log('error has occurred ', error);
        return
    }
    console.log(`Server is running on port ${port}`);
})