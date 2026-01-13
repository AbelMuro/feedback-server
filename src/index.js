const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const CreateFeedback = require('./Routes/POST/CreateFeedback.js');
const Register = require('./Routes/POST/Register.js');
const Login = require('./Routes/PUT/Login.js');
const Logout = require('./Routes/DELETE/Logout.js');
const ForgotPassword = require('./Routes/PUT/ForgotPassword.js');
const ResetPassword = require('./Routes/PUT/ResetPassword.js');
const Authorization = require('./Routes/GET/Authorization.js');
const UpdateAccount = require('./Routes/PUT/UpdateAccount.js');
const GetAccount = require('./Routes/GET/GetAccount.js');
const GetAccountImage = require('./Routes/GET/GetAccountImage.js');
const port = 4000;


app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    allowedHeaders: ['Authorization', 'Content-Type'],
    methods: ['POST', 'PUT', 'DELETE', 'GET'],
    credentials: true
}));


app.use(CreateFeedback);
app.use(Register);
app.use(Login);
app.use(Logout);
app.use(ForgotPassword);
app.use(ResetPassword);
app.use(Authorization);
app.use(UpdateAccount);
app.use(GetAccount);
app.use(GetAccountImage);

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