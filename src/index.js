const express = require('express');
const cors = require('cors');
const app = express();
const CreateFeedback = require('./Routes/POST/CreateFeedback.js');
const RegisterAccount = require('./Routes/POST/RegisterAccount.js');
const Login = require('./Routes/PUT/Login.js');
const ForgotPassword = require('./Routes/PUT/ForgotPassword.js');
const ResetPassword = require('./Routes/PUT/ResetPassword.js');
const Authorization = require('./Routes/GET/Authorization.js');
const port = 4000;


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
app.use(ForgotPassword);
app.use(ResetPassword);
app.use(Authorization);

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