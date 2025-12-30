const mysql = require('mysql2/promise');
const {config} = require('dotenv');
config();

const pool = mysql.createPool({
        host: process.env.host,                            // Go to Administration -> Users and privileges -> select a user and host
        user: process.env.user,                            // Go to Administration -> Users and privileges -> select a user and host
        password: process.env.password,                        // Go to Administration -> Users and privileges -> select a user and create a password
        database: process.env.database,                        // The name of the schema/database
        connectionLimit: 10,
});

module.exports = pool;