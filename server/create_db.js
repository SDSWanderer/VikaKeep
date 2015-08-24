'use strict'
var fs     = require('fs');
var db     = require('mysql-promise')();

var config = require('./config');
config.db.multipleStatements = true;

var sql = fs.readFileSync('./db.sql', 'utf8');

db.configure(config.db);

console.log("EXECUTE SQL STATEMENTS:\n", sql);
db.query(sql).spread(function(queriesInfo) {
    console.log('EXECUTED ' + queriesInfo.length + ' STATEMENTS');
})
.done(process.exit);
