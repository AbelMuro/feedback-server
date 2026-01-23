const mySQLEvents = require('mysql-events');
const {config} = require('dotenv');
config();

const watcher = mySQLEvents({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
});

module.exports = watcher;
