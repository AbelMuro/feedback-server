const express = require('express');
const cors = require('cors');
const app = express();
const CreateFeedback = require('./Routes/POST/CreateFeedback.js');
const RegisterAccount = require('./Routes/POST/RegisterAccount.js');
const Login = require('./Routes/PUT/Login.js');
const port = 4000;

/*

    this is where i left off, i need to test out the login and register functionality on the back end
*/


app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    allowedHeaders: ['Authorization', 'Content-Type'],
    methods: ['POST', 'PUT', 'DELETE'],
    credentials: true
}));


app.use(CreateFeedback);
app.use(RegisterAccount);
app.use(Login);

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