//   MySQL 로드
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 5,
    host     : 'localhost',
    user     : 'root',
    password : 'gujc1004',
    database : 'board'    
});

module.exports = pool;
