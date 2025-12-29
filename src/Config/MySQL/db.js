const mysql = require('mysql2');

const pool = mysql.createPool({
        host: '',                            // Go to Administration -> Users and privileges -> select a user and host
        user: '',                            // Go to Administration -> Users and privileges -> select a user and host
        password: '',                        // Go to Administration -> Users and privileges -> select a user and create a password
        database: '',                        // The name of the schema/database
        connectionLimit: 10,
});

module.exports = pool;