var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_fuma',
  password        : 'Hyms2413',
  database        : 'cs340_fuma'
});
module.exports.pool = pool;
