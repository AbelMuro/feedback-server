const express = require('express');
const cors = require('cors');
const app = express();
const CreateFeedback = require('./Routes/POST/CreateFeedback.js');
const port = 4000;


app.use(express.json());
app.use(cors({
    origin: '*',
    allowedHeaders: ['Authorization', 'Content-Type'],
    methods: ['POST', 'PUT', 'DELETE'],
}));


app.use(CreateFeedback);

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