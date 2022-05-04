var mysql = require('mysql');
const host = process.env.RDS_HOSTNAME || 'localhost';
const user = process.env.RDS_USERNAME || 'root'; 
const password = process.env.RDS_PASSWORD || ''; 
const port = process.env.RDS_PORT || '';
const database = process.env.RDS_DB_NAME || 'node'; 
var conn = mysql.createConnection({
    host     : host,
    user     : user,
    password : password,
    port     : port,
    database : database
});
conn.connect(function(err) {
    if (err) throw err;
    console.log('Database is connected successfully !');
});
module.exports = conn;